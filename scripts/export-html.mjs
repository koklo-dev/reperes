// Convertit les maquettes .dc.html (mockups/) en pages HTML statiques autonomes (html/).
// Usage : node scripts/export-html.mjs
// Gère : <helmet>, <sc-for>, trous {{chemin.pointé}}, renderVals() de la classe Component.
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = join(root, 'mockups');
const outDir = join(root, 'html');
mkdirSync(outDir, { recursive: true });

// Nom de fichier de sortie pour chaque maquette
const outName = (name) => (name === 'Main.dc.html' ? 'index.html' : name.replace('.dc.html', '.html').toLowerCase());

const escapeHtml = (v) => String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const lookup = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
const fill = (tpl, scope) =>
  tpl.replace(/\{\{\s*([\w.$]+)\s*\}\}/g, (_, path) => {
    const v = lookup(scope, path);
    if (v === undefined) throw new Error('Trou non résolu : {{' + path + '}}');
    return escapeHtml(v);
  });

function renderVals(scriptCode) {
  class DCLogic {
    constructor() {
      this.props = {};
      this.state = {};
    }
  }
  const Component = new Function('DCLogic', scriptCode + '\nreturn Component;')(DCLogic);
  return new Component().renderVals();
}

const files = readdirSync(srcDir).filter((f) => f.endsWith('.dc.html'));
for (const file of files) {
  const src = readFileSync(join(srcDir, file), 'utf8');
  const title = (src.match(/<title>([\s\S]*?)<\/title>/) || [, file])[1];
  const lang = (src.match(/<html lang="([^"]+)"/) || [, 'fr'])[1];
  const helmet = (src.match(/<helmet>([\s\S]*?)<\/helmet>/) || [, ''])[1];
  const xdc = src.match(/<x-dc>([\s\S]*?)<\/x-dc>/)[1].replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  const script = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
  const vals = renderVals(script);

  // 1. Boucles <sc-for>
  let body = xdc.replace(
    /<sc-for\s+list="\{\{\s*([\w.]+)\s*\}\}"\s+as="(\w+)"[^>]*>([\s\S]*?)<\/sc-for>/g,
    (_, listName, alias, inner) =>
      lookup(vals, listName)
        .map((item, i) => fill(inner, { ...vals, [alias]: item, $index: i }))
        .join('')
  );
  // 2. Trous restants (accent, etc.)
  body = fill(body, vals);
  // 3. Liens entre pages
  body = body.replace(/href="([A-Za-z]+\.dc\.html)"/g, (_, f) => 'href="' + outName(f) + '"');

  if (/\{\{|<sc-|<dc-import/.test(body)) throw new Error(file + ' : syntaxe de maquette restante');

  const html = `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
${helmet.trim()}
</head>
<body>
${body.trim()}
</body>
</html>
`;
  writeFileSync(join(outDir, outName(file)), html);
  console.log('OK', file, '→ html/' + outName(file), `(${html.length} octets)`);
}

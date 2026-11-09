# DESIGN — REPÈRES

Identité : **blueprint technique, tricolore sobre**. Plan d'architecte numérique : fond bleu nuit à points, filets fins, repères d'angle en L, typographie monospace pour les données. Référence visuelle : `html/index.html` et les autres pages de `html/`.

## 1. Principes

1. **Structure visible** : tout est cadré par deux filets (haut et bas) et quatre repères d'angle, pas par une boîte fermée.
2. **Aucun arrondi** : `border-radius: 0` partout.
3. **Rouge rare** : un seul accent par écran, réservé à ce qui est actif ou important (courbe France, période sélectionnée, chiffre clé).
4. **Neutralité politique** : jamais de bleu/rouge pour désigner des camps. Les périodes de pouvoir sont des bandes grises alternées.
5. **Lisibilité avant décor** : la grille de points est le seul fond décoratif ; les repères d'angle n'encadrent que les blocs importants (cartes de chiffres, graphes, questions).

## 2. Tokens

```css
:root {
  /* Fonds */
  --ground:        #0B1530;  /* fond de page */
  --ground-deep:   #060D22;  /* bandeau haut, pied de page, en-têtes de tableau */
  --panel:         rgba(11, 21, 48, 0.88); /* cartes posées sur la grille */
  /* Lignes */
  --grid-dot:      #1E2F5C;  /* points du fond et filets discrets */
  --line:          #1E2F5C;
  --line-strong:   #3A4F8A;  /* filets haut/bas des cadres, bordures de tableaux */
  /* Bandes de pouvoir (alternées, sans signification partisane) */
  --band-a:        #14234A;
  --band-b:        #1B2D5E;
  --hatch:         #7F8FBF;  /* hachures de cohabitation */
  /* Texte */
  --ink:           #F4F1EA;  /* blanc cassé : texte, repères d'angle, courbe de comparaison */
  --muted:         #A9B4D6;  /* texte secondaire, étiquettes */
  /* Accent (rouge, pas le rouge institutionnel) */
  --accent:        #E8493F;
}
```

Contrastes calculés sur `--ground` : `--ink` > 15:1, `--muted` ≈ 8:1, `--accent` ≈ 4,7:1 (suffisant pour du texte à partir de 11 px en gras ou 14 px normal ; ne pas descendre sous cette valeur).

À éviter : le bleu `#000091` et le rouge `#E1000F` du système de design de l'État, pour ne pas faire passer le site pour un site officiel.

## 3. Typographie

- **Titres** : Space Grotesk, 700. H1 `clamp(36px, 5vw, 68px)`, interligne 1.02–1.04, `letter-spacing: -0.02em`. H2 26–28 px. H3 22–26 px.
- **Corps, données, étiquettes** : JetBrains Mono. Corps 14 px (interligne 1.6), texte d'introduction 15 px.
- **Étiquettes** (kickers, en-têtes de tableau, légendes) : 11–12 px, majuscules, `letter-spacing: 0.08–0.12em`, couleur `--muted`.
- **Kickers de section** : préfixe `//` (ex. `// 01 — Indicateurs clés`), accompagné d'un filet horizontal `1px var(--line)` qui prend la place restante.
- **Chiffres clés** : Space Grotesk 700, 44–48 px, `letter-spacing: -0.02em`. Utiliser `font-variant-numeric: tabular-nums` dans les tableaux.

Polices : `https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap` (ou auto-hébergées via `next/font`).

## 4. Grille et espacements

- Conteneur : `max-width: 1280px`, marges latérales 32 px, centré. Sur mobile, 16 px.
- Sections : espacement vertical 48–72 px ; entre cartes 24 px.
- Grilles responsives : `grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))` (cartes de chiffres), `minmax(280px, 1fr)` (secteurs, définitions), `minmax(300px, 1fr)` (questions).
- Grilles à filets fins (secteurs, méthode, glossaire) : `gap: 1px` avec fond `--line-strong` sur le parent et `--ground` sur les enfants, pour obtenir des filets d'un pixel sans déclarer de bordures.
- Fond de page :
  ```css
  background-color: var(--ground);
  background-image: radial-gradient(var(--grid-dot) 1px, transparent 1px);
  background-size: 24px 24px;
  ```

## 5. Composants

### 5.1 Frame (cadre à repères d'angle)

Deux filets (haut, bas) de `1px var(--line-strong)` et quatre repères en L de 12 px, trait `2px var(--ink)`, posés exactement sur les coins. Pas de bordures latérales.

```css
.frame {
  --c: var(--ink);
  position: relative;
  border-block: 1px solid var(--line-strong);
  background:
    linear-gradient(var(--c), var(--c)) top left    / 12px 2px no-repeat,
    linear-gradient(var(--c), var(--c)) top left    / 2px 12px no-repeat,
    linear-gradient(var(--c), var(--c)) top right   / 12px 2px no-repeat,
    linear-gradient(var(--c), var(--c)) top right   / 2px 12px no-repeat,
    linear-gradient(var(--c), var(--c)) bottom left / 12px 2px no-repeat,
    linear-gradient(var(--c), var(--c)) bottom left / 2px 12px no-repeat,
    linear-gradient(var(--c), var(--c)) bottom right/ 12px 2px no-repeat,
    linear-gradient(var(--c), var(--c)) bottom right/ 2px 12px no-repeat,
    var(--panel);
  padding: 24px;
}
```

Composant React suggéré : `<Frame as="section">…</Frame>` dans `packages/ui`. Variante `compact` (padding 20 px) pour les tables du modèle de données.

### 5.2 KeyFigure (indicateur clé)

Dans un `Frame` : ligne d'étiquettes (`01` à gauche, secteur à droite), chiffre en Space Grotesk 48 px (rouge pour un seul chiffre de la page), note (12 px, `--ink`), variation (12 px, `--muted`), filet pointillé `1px dashed var(--line-strong)` puis ligne « Source : … » en 11 px.

### 5.3 Boutons de contrôle (pills carrées)

Hauteur 44 px minimum, `border-radius: 0`, majuscules 12 px.
- Inactif : fond transparent, bordure `1px var(--line-strong)`, texte `--ink`.
- Actif : fond `--ink`, texte `--ground`, bordure `--ink`.
- Groupe « Décalage des effets » : boutons carrés 44×44 (0, 1, 2, 3, 5) suivis de « ans ».
- Utiliser de vrais `<button type="button">` avec `aria-pressed`.

### 5.4 Graphe avec frise du pouvoir

- Zone de tracé : grille horizontale `--line`, repères `+` aux quatre coins, étiquettes d'axe 10 px `--muted`, sous-titre d'échelle (« % · échelle indicative » dans la maquette ; à remplacer par l'unité réelle).
- **Courbe France** : `--accent`, 2,5 px, point final plein avec réticule (`+`) et étiquette `T/AAAA · valeur`.
- **Courbe de comparaison** (zone euro, Allemagne) : `--ink`, 1,5 px, tirets `6 4`.
- **Frise des présidents** sous le tracé : rectangles de 26 px de haut, fonds alternés `--band-a` / `--band-b`, bordure `--line-strong`, nom en majuscules monospace 10 px centré. Période sélectionnée entourée d'un contour `--accent` 1,5 px.
- **Cohabitations** : rangée dessous, rectangles de 22 px à hachures 45° (`--hatch`), libellé « COHABITATION » sur fond `--ground` si la place le permet.
- **Repères verticaux** aux changements de pouvoir : pointillés `2 4` en `--line-strong`.
- **Décisions** : losange plein `--ink` numéroté ; **contexte** : cercle contour `--ink` avec une lettre. Chaque repère a une ligne pointillée `1 3` et une entrée dans la liste « Repères du graphique » (date, intitulé, source).
- **Rupture de série** : ligne verticale pointillée `--accent` avec étiquette, et **interruption de la courbe** (ne pas relier les points).
- Légende en dessous, séparée par un filet pointillé, puis ligne « Source : … ».
- Toujours fournir un tableau de données équivalent (accessibilité).
- Bibliothèque : Observable Plot ou ECharts, mais mêmes règles visuelles.

### 5.5 Tableaux

Grille à filets 1 px (`gap: 1px`, fond `--line-strong`), en-têtes sur `--ground-deep` en 11 px majuscules `--muted`, cellules sur `--ground`, texte 12 px. Conteneur `overflow-x: auto` avec `min-width` sur la grille pour le mobile.

### 5.6 Cartes de question (page Immigration)

`Frame` large : numéro `Q.01` (11 px, `--muted`), titre Space Grotesk 26 px, puis deux colonnes à filets (`Études concluant à un apport` / `… à un coût`, ou `Ce que montrent les statistiques` / `Réserves de lecture`), chacune avec sa ligne « Source : … ». Ligne finale « Pourquoi les résultats diffèrent » avec libellé en `--accent`. Le titre des colonnes doit rester symétrique et neutre.

### 5.7 Navigation et en-tête

- Bandeau supérieur `--ground-deep` en 11 px majuscules (statut de la maquette, version, période).
- En-tête : logo (carré 28 px avec réticule rouge) + mot-symbole Space Grotesk 20 px, `letter-spacing: 0.14em` ; navigation en 12 px majuscules ; page courante soulignée de `inset 0 -2px 0 var(--accent)` avec `aria-current="page"`.
- Zones cliquables de 44 px minimum.

### 5.8 Pied de page

Fond `--ground-deep`, filet haut `--line`, sources et statut en 11 px majuscules `--muted`.

## 6. Mouvement

Sobre : transitions de 120–160 ms sur la couleur et la bordure au survol/focus. Pas d'animation décorative. Respecter `prefers-reduced-motion`. Les graphes peuvent se tracer à l'arrivée (≤ 600 ms), désactivé en mouvement réduit.

## 7. Accessibilité

- Contraste ≥ 4,5:1 pour tout texte.
- Anneau de focus visible : `outline: 2px solid var(--ink); outline-offset: 2px`.
- Les couleurs ne portent jamais seules l'information (bandes alternées + noms, hachures + libellé, losange/cercle + lettre/chiffre).
- Graphes : `role="img"` avec `aria-label` descriptif, et tableau de données équivalent.
- Éléments interactifs en vrais `<button>` / `<a>`.

## 8. À faire / À ne pas faire

À faire : monospace pour tout nombre, source sous chaque graphe, bords à 90°, rouge uniquement sur l'élément actif.
À ne pas faire : dégradés, ombres portées, coins arrondis, pastilles de couleur gauche/droite, scores ou jauges « bon / mauvais », emoji, rouge utilisé en décor.

## 9. Correspondance maquette → composants

| Maquette | Composant à créer |
|---|---|
| En-tête et navigation | `SiteHeader`, `StatusBar` |
| Cadre à repères d'angle | `Frame` |
| Cartes de chiffres | `KeyFigure` |
| Barre de contrôles | `ControlBar`, `PillButton`, `LagSelector` |
| Graphe et frise | `TimelineChart`, `PowerBands`, `EventMarkers` |
| Tableau par exécutif | `DataTable` |
| Panneau « Ce que ce graphique ne dit pas » | `CaveatsPanel` |
| Définitions et questions | `DefinitionCard`, `QuestionPanel` |
| Pipeline, modèle de données, catalogue | `PipelineStep`, `TableSpec`, `CatalogTable` |
| Pied de page | `SiteFooter` |

## 10. Fichiers de référence

- `html/index.html`, `html/chomage.html`, `html/immigration.html`, `html/methode.html` : rendu de référence (ouvrir dans un navigateur).
- `mockups/*.dc.html` : sources des maquettes avec les valeurs de style exactes.
- Les valeurs de la maquette (« X,X % », courbes factices) sont des espaces réservés.

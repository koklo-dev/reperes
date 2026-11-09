export const dynamic = 'force-dynamic';

// Healthcheck du manifest : volontairement sans accès base (le conteneur doit répondre même si la db redémarre).
export function GET() {
  return Response.json({ status: 'ok', version: process.env.APP_VERSION ?? 'dev' });
}

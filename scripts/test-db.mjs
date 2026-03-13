/**
 * Testet die Datenbankverbindung (z. B. Supabase).
 * Aufruf: node --env-file=.env scripts/test-db.mjs
 */
import pg from 'pg';

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('FEHLER: DATABASE_URL ist nicht gesetzt. Starte mit: node --env-file=.env scripts/test-db.mjs');
  process.exit(1);
}

// URL ohne Passwort für Ausgabe
const safeUrl = url.replace(/:[^:@]+@/, ':****@');
console.log('DATABASE_URL (ohne Passwort):', safeUrl);
console.log('Verbinde (Timeout 15s)...\n');

const connectionString = url.includes('?') ? url.split('?')[0] : url;
const isSupabase = url.includes('supabase');

const client = new pg.Client({
  connectionString,
  connectionTimeoutMillis: 15_000,
  ssl: isSupabase ? { rejectUnauthorized: false } : undefined,
});

try {
  await client.connect();
  const r = await client.query('SELECT current_database(), current_user');
  console.log('✓ Verbindung OK:', r.rows[0]);
  await client.end();
  process.exit(0);
} catch (err) {
  console.error('✗ Verbindung fehlgeschlagen:');
  console.error('  Code:', err.code || '(keiner)');
  console.error('  Message:', err.message);
  if (err.cause) console.error('  Cause:', err.cause);
  process.exit(1);
}

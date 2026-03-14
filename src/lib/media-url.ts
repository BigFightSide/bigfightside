/**
 * Liefert die anzeigbare URL für ein Media-Objekt.
 * Ersetzt localhost/127.0.0.1 durch NEXT_PUBLIC_SERVER_URL, damit Bilder
 * auf Vercel/Production laden, wenn die Daten lokal erstellt wurden.
 * Relative URLs werden mit der Server-URL versehen, falls gesetzt.
 */
export function getMediaDisplayUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null
  const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '')
  // URL zeigt auf localhost → für Production durch Server-URL ersetzen
  if (url.startsWith('http') && (url.includes('localhost') || url.includes('127.0.0.1'))) {
    if (base) return url.replace(/^https?:\/\/[^/]+/, base)
    return url
  }
  // Relative URL (z. B. /media/…) → mit Basis versehen, damit sie auf Vercel funktioniert
  if (!url.startsWith('http') && base) {
    return `${base}${url.startsWith('/') ? url : `/${url}`}`
  }
  return url
}

import Link from 'next/link'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Datenschutz | Big Fight Side',
  description: 'Datenschutzerklärung von Big Fight Side',
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-anthracite text-white font-sans">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-muted-light transition hover:text-accent"
          >
            ← Zurück
          </Link>
          <h1 className="mt-4 font-bold text-3xl text-white sm:text-4xl">
            Datenschutz
          </h1>
          <p className="mt-2 text-muted-light">
            Informationen zum Umgang mit Ihren Daten
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="prose prose-invert max-w-none space-y-6 text-sm text-muted-light">
          <p>
            Der Schutz Ihrer personenbezogenen Daten ist uns wichtig. Diese Seite informiert Sie über die Erhebung und Verarbeitung von Daten bei der Nutzung unseres Angebots.
          </p>
          <h2 className="text-base font-semibold text-white">Verantwortliche Stelle</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist Big Fight Side. Kontaktmöglichkeiten finden Sie im <Link href="/contact" className="text-accent hover:underline">Kontaktbereich</Link>.
          </p>
          <h2 className="text-base font-semibold text-white">Erhebung von Daten</h2>
          <p>
            Beim Besuch dieser Website werden technisch notwendige Daten (z. B. IP-Adresse, Zugriffszeit) in Server-Logs erfasst. Sofern Sie uns per E-Mail oder Formular kontaktieren, werden die von Ihnen angegebenen Daten zur Bearbeitung Ihrer Anfrage verarbeitet.
          </p>
          <h2 className="text-base font-semibold text-white">Cookies</h2>
          <p>
            Diese Website kann Cookies verwenden. Details und Einstellungsmöglichkeiten finden Sie unter <Link href="/cookies" className="text-accent hover:underline">Cookie-Einstellungen</Link>.
          </p>
          <h2 className="text-base font-semibold text-white">Ihre Rechte</h2>
          <p>
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten sowie auf Datenübertragbarkeit. Bei Fragen wenden Sie sich bitte an uns.
          </p>
          <p className="pt-4 text-xs text-muted">
            Stand: {new Date().toLocaleDateString('de-DE')}. Diese Datenschutzerklärung ist eine Platzhalter-Vorlage und sollte von Ihnen an die tatsächliche Verarbeitung angepasst werden.
          </p>
        </div>
      </section>
    </main>
  )
}

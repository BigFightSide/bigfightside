import Link from 'next/link'

export const metadata = {
  title: 'Impressum | Big Fight Side',
  description: 'Impressum und rechtliche Hinweise von Big Fight Side',
}

export default function ImpressumPage() {
  return (
    <div className="bg-anthracite text-white font-sans">
      <section className="border-b border-border bg-anthracite-light">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-muted-light transition hover:text-gold">
            ← Zurück
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Impressum</h1>
          <p className="mt-2 text-muted-light">Angaben gemäß der gesetzlichen Informationspflichten in Deutschland.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="space-y-8 rounded-xl border border-border bg-anthracite-light/70 p-6 text-sm text-muted-light sm:p-8">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">Angaben gemäß § 5 TMG</h2>
            <p>[Name des Betreibers / Firma]</p>
            <p>[Vollständige Anschrift (Straße, PLZ, Ort: Pfungstadt/Darmstadt Bereich)]</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">Kontakt</h2>
            <p>E-Mail: [E-Mail-Adresse]</p>
            <p>Telefon: [Telefonnummer]</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">Steuerangaben</h2>
            <p>Steuernummer / USt-IdNr.: [Steuernummer / USt-IdNr. (falls vorhanden)]</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
            <p>[Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV]</p>
          </section>

          <section id="affiliate-hinweis" className="space-y-3 rounded-lg border border-gold/40 bg-gold/10 p-4">
            <h2 className="text-base font-semibold text-gold">Disclaimer: Affiliate & Glücksspiel</h2>
            <p>
              <span className="font-semibold text-white">Affiliate-Hinweis:</span> Diese Website enthält Werbelinks und
              Partnerverlinkungen, insbesondere in Bereichen wie Warehouse und Partner. Bei qualifizierten Aktionen
              kann eine Provision an uns fließen.
            </p>
            <p>
              <span className="font-semibold text-white">Glücksspiel-Hinweis:</span> Spielteilnahme ab 18 Jahren.
              Glücksspiel kann süchtig machen. Infos unter buwei.de
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-white">Haftung für Inhalte</h2>
            <p>
              Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
              Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
            </p>
          </section>
        </div>
      </section>
    </div>
  )
}

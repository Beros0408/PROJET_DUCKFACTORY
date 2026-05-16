import Link from 'next/link'

interface CTASectionProps {
  lang: 'fr' | 'en'
}

const content = {
  fr: {
    title: 'Prêt à devenir viral ?',
    subtitle: 'Rejoins des créateurs qui automatisent leur production de contenu avec DuckFactory.',
    cta: 'Créer mon compte gratuit',
    sub: 'Gratuit pour commencer. Sans carte bancaire.',
  },
  en: {
    title: 'Ready to go viral?',
    subtitle: 'Join creators who automate their content production with DuckFactory.',
    cta: 'Create my free account',
    sub: 'Free to start. No credit card required.',
  },
}

export function CTASection({ lang }: CTASectionProps) {
  const c = content[lang]

  return (
    <section className="py-24 bg-yellow-400">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="text-6xl mb-6">🦆</div>
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{c.title}</h2>
        <p className="text-gray-700 text-xl mb-10">{c.subtitle}</p>
        <Link
          href="/signup"
          className="inline-block bg-gray-900 text-white font-bold px-10 py-5 rounded-2xl text-xl transition-all hover:bg-gray-800 hover:shadow-2xl hover:-translate-y-1"
        >
          {c.cta}
        </Link>
        <p className="text-gray-600 text-sm mt-4">{c.sub}</p>
      </div>
    </section>
  )
}

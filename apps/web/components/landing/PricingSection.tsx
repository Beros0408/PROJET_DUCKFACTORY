import Link from 'next/link'

interface PricingSectionProps {
  lang: 'fr' | 'en'
}

const content = {
  fr: {
    title: 'Tarifs simples et transparents',
    subtitle: 'Commencez gratuitement, évoluez selon votre croissance.',
    perMonth: '/mois',
    popular: 'Plus populaire',
    plans: [
      {
        name: 'Free',
        price: '0',
        desc: 'Pour découvrir DuckFactory',
        features: ['3 vidéos/mois', '1 personnage', 'Watermark DuckFactory', 'Support communauté'],
        cta: 'Commencer',
        href: '/signup',
        highlighted: false,
      },
      {
        name: 'Creator',
        price: '49',
        desc: 'Pour les créateurs sérieux',
        features: ['30 vidéos/mois', '3 personnages', 'Sans watermark', '5 plateformes', 'Support prioritaire'],
        cta: 'Choisir Creator',
        href: '/signup',
        highlighted: true,
      },
      {
        name: 'Pro',
        price: '99',
        desc: 'Pour scaler votre business',
        features: ['Vidéos illimitées', '10 personnages', 'Voice cloning', 'API access', 'Support dédié'],
        cta: 'Choisir Pro',
        href: '/signup',
        highlighted: false,
      },
      {
        name: 'Agency',
        price: '299',
        desc: 'Pour les agences et studios',
        features: ['Tout Pro', 'Multi-comptes clients', 'White-label', 'Onboarding dédié', 'SLA garanti'],
        cta: 'Nous contacter',
        href: '/contact',
        highlighted: false,
      },
    ],
  },
  en: {
    title: 'Simple, transparent pricing',
    subtitle: 'Start free, scale as you grow.',
    perMonth: '/month',
    popular: 'Most popular',
    plans: [
      {
        name: 'Free',
        price: '0',
        desc: 'Discover DuckFactory',
        features: ['3 videos/month', '1 character', 'DuckFactory watermark', 'Community support'],
        cta: 'Get started',
        href: '/signup',
        highlighted: false,
      },
      {
        name: 'Creator',
        price: '49',
        desc: 'For serious creators',
        features: ['30 videos/month', '3 characters', 'No watermark', '5 platforms', 'Priority support'],
        cta: 'Choose Creator',
        href: '/signup',
        highlighted: true,
      },
      {
        name: 'Pro',
        price: '99',
        desc: 'To scale your business',
        features: ['Unlimited videos', '10 characters', 'Voice cloning', 'API access', 'Dedicated support'],
        cta: 'Choose Pro',
        href: '/signup',
        highlighted: false,
      },
      {
        name: 'Agency',
        price: '299',
        desc: 'For agencies and studios',
        features: ['Everything in Pro', 'Multi-client accounts', 'White-label', 'Dedicated onboarding', 'SLA guarantee'],
        cta: 'Contact us',
        href: '/contact',
        highlighted: false,
      },
    ],
  },
}

export function PricingSection({ lang }: PricingSectionProps) {
  const c = content[lang]

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
          <p className="text-xl text-gray-500">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {c.plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border transition-all ${
                plan.highlighted
                  ? 'bg-yellow-400 border-yellow-400 shadow-xl scale-105'
                  : 'bg-white border-gray-200 hover:border-yellow-300 hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {c.popular}
                </div>
              )}

              <div className="mb-6">
                <h3 className={`font-bold text-xl mb-1 ${plan.highlighted ? 'text-gray-900' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-gray-700' : 'text-gray-500'}`}>
                  {plan.desc}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold ${plan.highlighted ? 'text-gray-900' : 'text-gray-900'}`}>
                    {plan.price === '0' ? lang === 'fr' ? 'Gratuit' : 'Free' : `${plan.price}€`}
                  </span>
                  {plan.price !== '0' && (
                    <span className={`text-sm ${plan.highlighted ? 'text-gray-700' : 'text-gray-400'}`}>
                      {c.perMonth}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <span className="text-green-500 font-bold">✓</span>
                    <span className={plan.highlighted ? 'text-gray-800' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center font-semibold py-3 rounded-xl transition-colors ${
                  plan.highlighted
                    ? 'bg-gray-900 text-white hover:bg-gray-800'
                    : 'bg-yellow-100 text-gray-900 hover:bg-yellow-200 border border-yellow-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

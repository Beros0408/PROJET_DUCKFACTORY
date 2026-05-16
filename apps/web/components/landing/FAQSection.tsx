'use client'

import { useState } from 'react'

interface FAQSectionProps {
  lang: 'fr' | 'en'
}

const content = {
  fr: {
    title: 'Questions fréquentes',
    subtitle: 'Tout ce que tu veux savoir sur DuckFactory.',
    faq: [
      {
        q: 'Comment ça marche exactement ?',
        a: 'Tu crées un personnage IA (avatar, voix, personnalité), puis DuckFactory génère automatiquement scripts, voix et vidéo. Tu n\'as plus qu\'à cliquer "Publier" pour envoyer sur toutes tes plateformes.',
      },
      {
        q: 'Quelles plateformes sont supportées ?',
        a: 'YouTube Shorts, TikTok, Instagram Reels et Facebook Reels. D\'autres plateformes arrivent (Pinterest, Twitter/X).',
      },
      {
        q: 'Puis-je publier sur mon propre compte YouTube ?',
        a: 'Oui ! Tu connectes ton compte YouTube via OAuth et DuckFactory publie directement sur ta chaîne. Tu gardes la propriété totale de ton contenu.',
      },
      {
        q: 'Combien de vidéos puis-je créer par mois ?',
        a: 'Cela dépend de ton plan : 3 en Free, 30 en Creator, illimité en Pro et Agency.',
      },
      {
        q: 'Est-ce que je garde mes revenus YouTube/TikTok ?',
        a: 'Absolument. Les revenus publicitaires, dons et partenariats sont entièrement à toi. DuckFactory ne prend aucune commission sur tes revenus.',
      },
      {
        q: 'Comment résilier mon abonnement ?',
        a: 'Tu peux résilier à tout moment depuis ton tableau de bord → Paramètres → Abonnement. Aucune période d\'engagement.',
      },
    ],
  },
  en: {
    title: 'Frequently asked questions',
    subtitle: 'Everything you want to know about DuckFactory.',
    faq: [
      {
        q: 'How does it work exactly?',
        a: 'You create an AI character (avatar, voice, personality), then DuckFactory automatically generates scripts, voice and video. Just click "Publish" to send to all your platforms.',
      },
      {
        q: 'Which platforms are supported?',
        a: 'YouTube Shorts, TikTok, Instagram Reels and Facebook Reels. More platforms coming (Pinterest, Twitter/X).',
      },
      {
        q: 'Can I publish on my own YouTube channel?',
        a: 'Yes! Connect your YouTube account via OAuth and DuckFactory publishes directly to your channel. You retain full ownership of your content.',
      },
      {
        q: 'How many videos can I create per month?',
        a: 'Depends on your plan: 3 on Free, 30 on Creator, unlimited on Pro and Agency.',
      },
      {
        q: 'Do I keep my YouTube/TikTok earnings?',
        a: 'Absolutely. Ad revenue, donations and partnerships are entirely yours. DuckFactory takes no commission on your earnings.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'You can cancel anytime from your dashboard → Settings → Subscription. No commitment period.',
      },
    ],
  },
}

export function FAQSection({ lang }: FAQSectionProps) {
  const c = content[lang]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
          <p className="text-xl text-gray-500">{c.subtitle}</p>
        </div>

        <div className="space-y-3">
          {c.faq.map((item, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900">{item.q}</span>
                <span className={`text-2xl text-yellow-500 transition-transform ml-4 flex-shrink-0 ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

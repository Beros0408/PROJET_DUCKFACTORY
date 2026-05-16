interface FeaturesSectionProps {
  lang: 'fr' | 'en'
}

const content = {
  fr: {
    title: 'Tout ce dont tu as besoin',
    subtitle: 'De l\'idée à la vidéo publiée, en automatique.',
    features: [
      {
        icon: '🤖',
        title: 'Génération de scripts IA',
        desc: 'GPT-4o crée 5 scripts viraux par jour, adaptés à ton personnage et aux tendances du moment.',
        tag: 'GPT-4o',
      },
      {
        icon: '🎤',
        title: 'Voix IA personnalisée',
        desc: 'ElevenLabs te donne une voix unique et reconnaissable, fidèle à la personnalité de ton avatar.',
        tag: 'ElevenLabs',
      },
      {
        icon: '🎬',
        title: 'Vidéos avatar parlant',
        desc: 'HeyGen génère tes vidéos automatiquement avec synchronisation labiale parfaite.',
        tag: 'HeyGen',
      },
      {
        icon: '📤',
        title: 'Publication multi-plateforme',
        desc: 'YouTube Shorts, TikTok, Instagram Reels — publie partout en 1 clic depuis le studio.',
        tag: 'Multi-plateforme',
      },
    ],
  },
  en: {
    title: 'Everything you need',
    subtitle: 'From idea to published video, on autopilot.',
    features: [
      {
        icon: '🤖',
        title: 'AI Script Generation',
        desc: 'GPT-4o creates 5 viral scripts per day, tailored to your character and trending topics.',
        tag: 'GPT-4o',
      },
      {
        icon: '🎤',
        title: 'Custom AI Voice',
        desc: 'ElevenLabs gives you a unique recognizable voice, true to your avatar\'s personality.',
        tag: 'ElevenLabs',
      },
      {
        icon: '🎬',
        title: 'Talking Avatar Videos',
        desc: 'HeyGen automatically generates your videos with perfect lip sync.',
        tag: 'HeyGen',
      },
      {
        icon: '📤',
        title: 'Multi-platform Publishing',
        desc: 'YouTube Shorts, TikTok, Instagram Reels — publish everywhere in 1 click from the studio.',
        tag: 'Multi-platform',
      },
    ],
  },
}

export function FeaturesSection({ lang }: FeaturesSectionProps) {
  const c = content[lang]

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
          <p className="text-xl text-gray-500">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {c.features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-yellow-200 hover:shadow-lg transition-all bg-white hover:bg-yellow-50/30"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <span className="inline-block text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full mb-3">
                {feature.tag}
              </span>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

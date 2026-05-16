interface HowItWorksSectionProps {
  lang: 'fr' | 'en'
}

const content = {
  fr: {
    title: 'Comment ça marche ?',
    subtitle: 'En 3 étapes simples, du zéro au viral.',
    steps: [
      {
        number: '01',
        icon: '🎭',
        title: 'Créez votre personnage',
        desc: 'Choisissez un nom, une personnalité, une voix et des tics verbaux. Votre avatar unique est prêt en 5 minutes.',
      },
      {
        number: '02',
        icon: '⚡',
        title: 'Générez votre contenu',
        desc: 'GPT-4o crée les scripts, ElevenLabs génère la voix, HeyGen produit la vidéo. Tout en automatique.',
      },
      {
        number: '03',
        icon: '🚀',
        title: 'Publiez partout',
        desc: 'Un clic pour publier sur YouTube Shorts, TikTok et Instagram Reels simultanément.',
      },
    ],
  },
  en: {
    title: 'How it works',
    subtitle: '3 simple steps, from zero to viral.',
    steps: [
      {
        number: '01',
        icon: '🎭',
        title: 'Create your character',
        desc: 'Choose a name, personality, voice and catchphrases. Your unique avatar is ready in 5 minutes.',
      },
      {
        number: '02',
        icon: '⚡',
        title: 'Generate your content',
        desc: 'GPT-4o creates scripts, ElevenLabs generates voice, HeyGen produces video. All automatic.',
      },
      {
        number: '03',
        icon: '🚀',
        title: 'Publish everywhere',
        desc: 'One click to publish on YouTube Shorts, TikTok and Instagram Reels simultaneously.',
      },
    ],
  },
}

export function HowItWorksSection({ lang }: HowItWorksSectionProps) {
  const c = content[lang]

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 to-sky-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{c.title}</h2>
          <p className="text-xl text-gray-500">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {c.steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {/* Connector line */}
              {i < c.steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-yellow-200" />
              )}

              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-2xl mb-6 shadow-lg">
                <span className="text-3xl">{step.icon}</span>
                <span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="font-bold text-gray-900 text-xl mb-3">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

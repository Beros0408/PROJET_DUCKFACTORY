'use client'

import { useState } from 'react'
import { createCharacter, type CreateCharacterInput } from '@/lib/api/characters'
import CharacterAvatar from './CharacterAvatar'

const PERSONALITIES = {
  fr: [
    { id: 'drole',   emoji: '😄', label: 'Drôle',    desc: 'Fait rire, utilise l\'humour' },
    { id: 'serieux', emoji: '🎯', label: 'Sérieux',   desc: 'Professionnel et fiable' },
    { id: 'sage',    emoji: '🦉', label: 'Sage',      desc: 'Philosophique et réfléchi' },
    { id: 'naif',    emoji: '🐥', label: 'Naïf',      desc: 'Curieux et innocent' },
  ],
  en: [
    { id: 'drole',   emoji: '😄', label: 'Funny',     desc: 'Makes people laugh' },
    { id: 'serieux', emoji: '🎯', label: 'Serious',   desc: 'Professional and reliable' },
    { id: 'sage',    emoji: '🦉', label: 'Wise',      desc: 'Philosophical and thoughtful' },
    { id: 'naif',    emoji: '🐥', label: 'Naive',     desc: 'Curious and innocent' },
  ],
}

const TONES = {
  fr: [
    { id: 'kid',    emoji: '👶', label: 'Enfants',  desc: '3–10 ans' },
    { id: 'teen',   emoji: '🧑', label: 'Ados',     desc: '11–17 ans' },
    { id: 'adult',  emoji: '👨', label: 'Adultes',  desc: 'Public général' },
    { id: 'expert', emoji: '🎓', label: 'Experts',  desc: 'Niche spécialisée' },
  ],
  en: [
    { id: 'kid',    emoji: '👶', label: 'Kids',     desc: 'Ages 3–10' },
    { id: 'teen',   emoji: '🧑', label: 'Teens',    desc: 'Ages 11–17' },
    { id: 'adult',  emoji: '👨', label: 'Adults',   desc: 'General audience' },
    { id: 'expert', emoji: '🎓', label: 'Experts',  desc: 'Specialized niche' },
  ],
}

const STEPS = {
  fr: ['Identité', 'Personnalité', 'Expression', 'Aperçu'],
  en: ['Identity',  'Personality',  'Expression', 'Preview'],
}

const t = {
  fr: {
    step1Title: 'Qui est ton personnage ?',
    namePlaceholder: 'Ex : Cancan le Canard',
    nameLabel: 'Nom du personnage *',
    descLabel: 'Description courte',
    descPlaceholder: 'Ex : Un canard naïf et drôle qui explique la tech',
    step2Title: 'Quelle est sa personnalité ?',
    personalityLabel: 'Caractère',
    toneLabel: 'Audience cible',
    step3Title: 'Comment s\'exprime-t-il ?',
    catchphraseLabel: 'Phrase culte',
    catchphrasePlaceholder: 'Ex : Coin coin !',
    ticLabel: 'Tic verbal',
    ticPlaceholder: 'Ex : En fait, c\'est très simple...',
    langLabel: 'Langue du personnage',
    step4Title: 'Tout est prêt !',
    step4Sub: 'Voici un aperçu de ton personnage.',
    submit: 'Créer le personnage 🦆',
    submitting: 'Création en cours...',
    back: '← Retour',
    next: 'Suivant →',
    required: 'Le nom est obligatoire.',
    personalityRequired: 'Choisis une personnalité.',
    toneRequired: 'Choisis une audience.',
    apiError: 'Erreur lors de la création. Réessaie.',
    personality: 'Personnalité',
    tone: 'Audience',
    catchphrase: 'Phrase culte',
    tic: 'Tic verbal',
    language: 'Langue',
    none: '—',
  },
  en: {
    step1Title: 'Who is your character?',
    namePlaceholder: 'e.g. Cancan the Duck',
    nameLabel: 'Character name *',
    descLabel: 'Short description',
    descPlaceholder: 'e.g. A naive and funny duck who explains tech',
    step2Title: 'What\'s their personality?',
    personalityLabel: 'Character',
    toneLabel: 'Target audience',
    step3Title: 'How do they express themselves?',
    catchphraseLabel: 'Catchphrase',
    catchphrasePlaceholder: 'e.g. Quack quack!',
    ticLabel: 'Verbal tic',
    ticPlaceholder: 'e.g. Actually, it\'s very simple...',
    langLabel: 'Character language',
    step4Title: 'All set!',
    step4Sub: 'Here\'s a preview of your character.',
    submit: 'Create character 🦆',
    submitting: 'Creating...',
    back: '← Back',
    next: 'Next →',
    required: 'Name is required.',
    personalityRequired: 'Choose a personality.',
    toneRequired: 'Choose an audience.',
    apiError: 'Creation failed. Please try again.',
    personality: 'Personality',
    tone: 'Audience',
    catchphrase: 'Catchphrase',
    tic: 'Verbal tic',
    language: 'Language',
    none: '—',
  },
}

interface CharacterFormProps {
  onSuccess: () => void
}

export default function CharacterForm({ onSuccess }: CharacterFormProps) {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<CreateCharacterInput>({
    name: '',
    description: '',
    personality: '',
    tone: '',
    catchphrase: '',
    tic_verbal: '',
    language: 'fr',
  })

  const tr = t[lang]
  const steps = STEPS[lang]
  const personalities = PERSONALITIES[lang]
  const tones = TONES[lang]

  function set(field: keyof CreateCharacterInput, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  function validateStep(): boolean {
    if (step === 1 && !form.name.trim()) { setError(tr.required); return false }
    if (step === 2 && !form.personality) { setError(tr.personalityRequired); return false }
    if (step === 2 && !form.tone) { setError(tr.toneRequired); return false }
    return true
  }

  function next() {
    if (validateStep()) setStep(s => Math.min(s + 1, 4))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      const payload: CreateCharacterInput = {
        name: form.name.trim(),
        personality: form.personality,
        tone: form.tone,
        language: form.language,
        ...(form.description?.trim() && { description: form.description.trim() }),
        ...(form.catchphrase?.trim() && { catchphrase: form.catchphrase.trim() }),
        ...(form.tic_verbal?.trim() && { tic_verbal: form.tic_verbal.trim() }),
      }
      await createCharacter(payload)
      onSuccess()
    } catch {
      setError(tr.apiError)
    } finally {
      setLoading(false)
    }
  }

  const personalityObj = personalities.find(p => p.id === form.personality)
  const toneObj = tones.find(t => t.id === form.tone)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg w-full mx-auto">
      {/* Lang toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1"
        >
          {lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
        </button>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center mb-8 gap-1">
        {steps.map((label, i) => (
          <div key={i} className="flex items-center gap-1">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${i + 1 < step ? 'bg-green-500 text-white' :
                i + 1 === step ? 'bg-yellow-400 text-gray-900' :
                'bg-gray-100 text-gray-400'}
            `}>
              {i + 1 < step ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-6 transition-colors ${i + 1 < step ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 — Identity */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900 text-center">{tr.step1Title}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tr.nameLabel}</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder={tr.namePlaceholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tr.descLabel}</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder={tr.descPlaceholder}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 2 — Personality + Tone */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 text-center">{tr.step2Title}</h2>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">{tr.personalityLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {personalities.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => set('personality', p.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    form.personality === p.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{p.label}</div>
                    <div className="text-xs text-gray-500">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">{tr.toneLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {tones.map(tone => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => set('tone', tone.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    form.tone === tone.id
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{tone.emoji}</span>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{tone.label}</div>
                    <div className="text-xs text-gray-500">{tone.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Expression */}
      {step === 3 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900 text-center">{tr.step3Title}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tr.catchphraseLabel}</label>
            <input
              type="text"
              value={form.catchphrase}
              onChange={e => set('catchphrase', e.target.value)}
              placeholder={tr.catchphrasePlaceholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{tr.ticLabel}</label>
            <input
              type="text"
              value={form.tic_verbal}
              onChange={e => set('tic_verbal', e.target.value)}
              placeholder={tr.ticPlaceholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">{tr.langLabel}</p>
            <div className="flex gap-2">
              {(['fr', 'en'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('language', l)}
                  className={`flex-1 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                    form.language === l
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {l === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Preview */}
      {step === 4 && (
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-gray-900 text-center">{tr.step4Title}</h2>
          <p className="text-gray-500 text-sm text-center">{tr.step4Sub}</p>
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-4">
              <CharacterAvatar name={form.name || '?'} personality={form.personality} size="lg" />
              <div>
                <p className="font-bold text-gray-900 text-xl">{form.name}</p>
                {form.description && <p className="text-gray-500 text-sm mt-0.5">{form.description}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-0.5">{tr.personality}</p>
                <p className="font-semibold text-gray-800">{personalityObj?.emoji} {personalityObj?.label ?? tr.none}</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-0.5">{tr.tone}</p>
                <p className="font-semibold text-gray-800">{toneObj?.emoji} {toneObj?.label ?? tr.none}</p>
              </div>
              {form.catchphrase && (
                <div className="bg-white rounded-xl p-3 col-span-2">
                  <p className="text-gray-400 text-xs mb-0.5">{tr.catchphrase}</p>
                  <p className="font-semibold text-gray-800 italic">&ldquo;{form.catchphrase}&rdquo;</p>
                </div>
              )}
              {form.tic_verbal && (
                <div className="bg-white rounded-xl p-3 col-span-2">
                  <p className="text-gray-400 text-xs mb-0.5">{tr.tic}</p>
                  <p className="font-semibold text-gray-800">{form.tic_verbal}</p>
                </div>
              )}
              <div className="bg-white rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-0.5">{tr.language}</p>
                <p className="font-semibold text-gray-800">{form.language === 'fr' ? '🇫🇷 Français' : '🇬🇧 English'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            {tr.back}
          </button>
        )}
        {step < 4 ? (
          <button
            type="button"
            onClick={next}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 rounded-xl transition-colors"
          >
            {tr.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? tr.submitting : tr.submit}
          </button>
        )}
      </div>
    </div>
  )
}

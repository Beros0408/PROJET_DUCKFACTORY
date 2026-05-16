'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const t = {
  fr: {
    title: 'Connexion',
    subtitle: 'Content de te revoir !',
    email: 'Email',
    password: 'Mot de passe',
    submit: 'Se connecter',
    submitting: 'Connexion...',
    noAccount: 'Pas encore de compte ?',
    signup: "S'inscrire",
    forgot: 'Mot de passe oublié ?',
    errors: {
      'Invalid login credentials': 'Email ou mot de passe incorrect.',
      'Email not confirmed': 'Vérifie ton email et clique sur le lien de confirmation.',
      default: 'Une erreur est survenue. Réessaie.',
    },
  },
  en: {
    title: 'Sign in',
    subtitle: 'Welcome back!',
    email: 'Email',
    password: 'Password',
    submit: 'Sign in',
    submitting: 'Signing in...',
    noAccount: "Don't have an account?",
    signup: 'Sign up',
    forgot: 'Forgot password?',
    errors: {
      'Invalid login credentials': 'Incorrect email or password.',
      'Email not confirmed': 'Check your email and click the confirmation link.',
      default: 'An error occurred. Please try again.',
    },
  },
}

export default function LoginPage() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const tr = t[lang]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError(lang === 'fr' ? 'Email invalide.' : 'Invalid email.')
      return
    }
    if (password.length < 6) {
      setError(lang === 'fr' ? 'Mot de passe trop court (min. 6 caractères).' : 'Password too short (min. 6 characters).')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)

    if (authError) {
      const msg = tr.errors[authError.message as keyof typeof tr.errors] ?? tr.errors.default
      setError(msg)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-4xl mb-3">🦆</div>
        <h1 className="text-2xl font-bold text-gray-900">{tr.title}</h1>
        <p className="text-gray-500 mt-1">{tr.subtitle}</p>
      </div>

      {/* Lang toggle */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setLang(l => l === 'fr' ? 'en' : 'fr')}
          className="text-xs text-gray-400 hover:text-gray-600 border border-gray-200 rounded px-2 py-1"
        >
          {lang === 'fr' ? '🇬🇧 English' : '🇫🇷 Français'}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{tr.email}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            placeholder="cancan@duckfactory.io"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">{tr.password}</label>
            <Link href="/forgot-password" className="text-xs text-yellow-600 hover:text-yellow-700">
              {tr.forgot}
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-60 disabled:cursor-not-allowed text-gray-900 font-bold py-3 rounded-xl transition-colors"
        >
          {loading ? tr.submitting : tr.submit}
        </button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-gray-500 mt-6">
        {tr.noAccount}{' '}
        <Link href="/signup" className="text-yellow-600 hover:text-yellow-700 font-semibold">
          {tr.signup}
        </Link>
      </p>
    </div>
  )
}

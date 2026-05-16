'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const t = {
  fr: {
    title: 'Créer un compte',
    subtitle: 'Rejoins DuckFactory gratuitement',
    email: 'Email',
    password: 'Mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    submit: 'Créer mon compte',
    submitting: 'Création...',
    hasAccount: 'Déjà un compte ?',
    login: 'Se connecter',
    successTitle: 'Vérifie ton email ! 📬',
    successMsg: 'Un lien de confirmation a été envoyé à',
    successSub: 'Clique sur le lien pour activer ton compte.',
    errors: {
      'User already registered': 'Cet email est déjà utilisé.',
      'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
      passwordMismatch: 'Les mots de passe ne correspondent pas.',
      weakPassword: 'Le mot de passe doit contenir au moins 6 caractères.',
      default: 'Une erreur est survenue. Réessaie.',
    },
  },
  en: {
    title: 'Create an account',
    subtitle: 'Join DuckFactory for free',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm password',
    submit: 'Create my account',
    submitting: 'Creating...',
    hasAccount: 'Already have an account?',
    login: 'Sign in',
    successTitle: 'Check your email! 📬',
    successMsg: 'A confirmation link was sent to',
    successSub: 'Click the link to activate your account.',
    errors: {
      'User already registered': 'This email is already in use.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters.',
      passwordMismatch: 'Passwords do not match.',
      weakPassword: 'Password must be at least 6 characters.',
      default: 'An error occurred. Please try again.',
    },
  },
}

export default function SignupPage() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const tr = t[lang]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.includes('@')) {
      setError(lang === 'fr' ? 'Email invalide.' : 'Invalid email.')
      return
    }
    if (password.length < 6) {
      setError(tr.errors.weakPassword)
      return
    }
    if (password !== confirm) {
      setError(tr.errors.passwordMismatch)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setLoading(false)

    if (authError) {
      const msg = tr.errors[authError.message as keyof typeof tr.errors] ?? tr.errors.default
      setError(msg)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="text-5xl mb-4">📬</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{tr.successTitle}</h2>
        <p className="text-gray-600 mb-1">{tr.successMsg}</p>
        <p className="text-yellow-600 font-semibold mb-4">{email}</p>
        <p className="text-gray-500 text-sm">{tr.successSub}</p>
        <Link
          href="/login"
          className="inline-block mt-6 text-yellow-600 hover:text-yellow-700 font-semibold text-sm"
        >
          ← {tr.login}
        </Link>
      </div>
    )
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
          <label className="block text-sm font-medium text-gray-700 mb-1">{tr.password}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{tr.confirmPassword}</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            autoComplete="new-password"
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

      <p className="text-center text-sm text-gray-500 mt-6">
        {tr.hasAccount}{' '}
        <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">
          {tr.login}
        </Link>
      </p>
    </div>
  )
}

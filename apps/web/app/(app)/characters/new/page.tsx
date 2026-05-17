'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CharacterForm from '@/components/characters/CharacterForm'

export default function NewCharacterPage() {
  const router = useRouter()

  function handleSuccess() {
    router.push('/characters')
    router.refresh()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/characters" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
          ← Mes personnages
        </Link>
      </div>
      <CharacterForm onSuccess={handleSuccess} />
    </div>
  )
}

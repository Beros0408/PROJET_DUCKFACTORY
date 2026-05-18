'use client'

import { useRouter } from 'next/navigation'
import CharacterForm from '@/components/characters/CharacterForm'
import BackButton from '@/components/common/BackButton'

export default function NewCharacterPage() {
  const router = useRouter()

  function handleSuccess() {
    router.push('/characters')
    router.refresh()
  }

  return (
    <div className="p-8">
      <BackButton href="/characters" label="Mes personnages" />
      <CharacterForm onSuccess={handleSuccess} />
    </div>
  )
}

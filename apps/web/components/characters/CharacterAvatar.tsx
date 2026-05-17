interface CharacterAvatarProps {
  name: string
  personality: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const PERSONALITY_COLORS: Record<string, string> = {
  drole:   'bg-yellow-100 text-yellow-700',
  serieux: 'bg-blue-100 text-blue-700',
  sage:    'bg-green-100 text-green-700',
  naif:    'bg-pink-100 text-pink-700',
}

const PERSONALITY_EMOJI: Record<string, string> = {
  drole:   '😄',
  serieux: '🎯',
  sage:    '🦉',
  naif:    '🐥',
}

const SIZE_CLASSES = {
  sm: 'w-10 h-10 text-base',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-24 h-24 text-4xl',
}

export default function CharacterAvatar({ name, personality, avatarUrl, size = 'md' }: CharacterAvatarProps) {
  const sizeClass = SIZE_CLASSES[size]
  const colorClass = PERSONALITY_COLORS[personality] ?? 'bg-gray-100 text-gray-700'

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClass} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {PERSONALITY_EMOJI[personality] ?? name.charAt(0).toUpperCase()}
    </div>
  )
}

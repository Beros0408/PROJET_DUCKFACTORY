import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DuckFactory — Studio IA de contenus viraux',
  description: 'Créez votre personnage IA et produisez des vidéos virales automatiquement. Propulsé par DuckFactory.',
  keywords: ['IA', 'vidéo virale', 'TikTok', 'YouTube Shorts', 'automatisation', 'contenu'],
  openGraph: {
    title: 'DuckFactory',
    description: 'Studio IA de production de contenus viraux',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

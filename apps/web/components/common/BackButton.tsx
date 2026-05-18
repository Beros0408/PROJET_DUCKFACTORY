import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  href: string
  label?: string
}

export default function BackButton({ href, label = 'Retour' }: Props) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors py-2 px-1 mb-4 text-sm font-medium min-h-[44px]"
    >
      <ArrowLeft size={16} />
      {label}
    </Link>
  )
}

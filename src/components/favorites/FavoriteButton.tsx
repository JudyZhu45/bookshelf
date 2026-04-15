'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import useFavorites from '@/hooks/useFavorites'

type Props = {
  olid: string
  title: string
  author: string | null
  coverUrl: string | null
}

export default function FavoriteButton({ olid, title, author, coverUrl }: Props) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { isFavorited, toggle, loading } = useFavorites(olid)

  async function handleClick() {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
    await toggle({ olid, title, author, coverUrl })
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs border transition-colors disabled:opacity-50 cursor-pointer"
      style={{
        borderRadius: '2px',
        background: isFavorited ? 'rgba(107, 45, 62, 0.15)' : 'var(--da-parchment-edge)',
        borderColor: isFavorited ? 'var(--da-burgundy)' : 'var(--da-parchment-dark)',
        color: isFavorited ? 'var(--da-burgundy-light)' : 'var(--da-ink-light)',
        fontFamily: 'var(--font-lora), Georgia, serif',
      }}
    >
      <span>{isFavorited ? '\u2665' : '\u2661'}</span>
      <span>{isFavorited ? 'Saved' : 'Save'}</span>
    </button>
  )
}

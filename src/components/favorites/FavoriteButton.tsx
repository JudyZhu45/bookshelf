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
      className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs border transition-colors ${
        isFavorited
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
          : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
      } disabled:opacity-50`}
    >
      <span>{isFavorited ? '♥' : '♡'}</span>
      <span>{isFavorited ? 'Saved' : 'Save'}</span>
    </button>
  )
}

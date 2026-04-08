'use client'

import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Status = 'want_to_read' | 'reading' | 'finished' | null

type Props = {
  olid: string
  title: string
  author: string | null
  coverUrl: string | null
}

const OPTIONS: { value: Status; label: string }[] = [
  { value: 'want_to_read', label: 'Want to read' },
  { value: 'reading', label: 'Reading' },
  { value: 'finished', label: 'Finished' },
]

export default function ReadingStatusPicker({ olid, title, author, coverUrl }: Props) {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [status, setStatus] = useState<Status>(null)
  const [loading, setLoading] = useState(false)

  async function handleChange(value: Status) {
    if (!isSignedIn) {
      router.push('/sign-in')
      return
    }
    if (value === status) return
    setLoading(true)
    setStatus(value)
    try {
      await fetch('/api/reading-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ olId: olid, status: value, title, author, coverUrl }),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => handleChange(opt.value)}
          disabled={loading}
          className={`w-full text-left px-3 py-1.5 rounded text-xs border transition-colors ${
            status === opt.value
              ? 'bg-stone-900 text-white border-stone-900'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          } disabled:opacity-50`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

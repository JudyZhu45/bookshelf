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
          className="w-full text-left px-3 py-1.5 text-xs border transition-colors disabled:opacity-50 cursor-pointer"
          style={{
            borderRadius: '2px',
            fontFamily: 'var(--font-lora), Georgia, serif',
            background: status === opt.value ? 'var(--da-wood)' : 'transparent',
            color: status === opt.value ? 'var(--da-parchment)' : 'var(--da-cream)',
            borderColor: status === opt.value ? 'var(--da-gold-muted)' : 'var(--da-wood)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

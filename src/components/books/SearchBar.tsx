'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  size?: 'sm' | 'lg'
  defaultValue?: string
}

export default function SearchBar({ size = 'sm', defaultValue = '' }: Props) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  const isLarge = size === 'lg'

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, authors..."
        className={`da-input w-full ${
          isLarge ? 'px-5 py-3 text-base' : 'px-4 py-1.5 text-sm'
        }`}
        style={{ borderRadius: '3px 0 0 3px' }}
      />
      <button
        type="submit"
        className={`da-btn da-btn-gold shrink-0 cursor-pointer ${
          isLarge ? 'px-6 py-3 text-base' : 'px-4 py-1.5 text-sm'
        }`}
        style={{ borderRadius: '0 3px 3px 0' }}
      >
        Search
      </button>
    </form>
  )
}

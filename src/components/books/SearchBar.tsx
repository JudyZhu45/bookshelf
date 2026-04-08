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

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search books, authors..."
        className={`w-full border border-stone-300 rounded-l-full bg-white focus:outline-none focus:ring-2 focus:ring-stone-400 ${
          size === 'lg' ? 'px-5 py-3 text-base' : 'px-4 py-1.5 text-sm'
        }`}
      />
      <button
        type="submit"
        className={`bg-stone-900 text-white rounded-r-full hover:bg-stone-700 transition-colors shrink-0 ${
          size === 'lg' ? 'px-6 py-3 text-base' : 'px-4 py-1.5 text-sm'
        }`}
      >
        Search
      </button>
    </form>
  )
}

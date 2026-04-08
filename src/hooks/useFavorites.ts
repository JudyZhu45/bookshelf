'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Favorite } from '@/types/database'

type BookInput = {
  olid: string
  title: string
  author: string | null
  coverUrl: string | null
}

// Simple in-memory cache shared across hook instances
const cache: { favorites: Favorite[] | null; loading: boolean } = {
  favorites: null,
  loading: false,
}
const listeners = new Set<() => void>()

function notify() {
  listeners.forEach((fn) => fn())
}

export default function useFavorites(olid?: string) {
  const [, rerender] = useState(0)

  useEffect(() => {
    const fn = () => rerender((n) => n + 1)
    listeners.add(fn)
    if (!cache.favorites && !cache.loading) {
      fetchFavorites()
    }
    return () => {
      listeners.delete(fn)
    }
  }, [])

  const isFavorited = olid ? (cache.favorites ?? []).some((f) => f.ol_work_id === olid) : false

  const toggle = useCallback(
    async (book: BookInput) => {
      if (!cache.favorites) return
      const existing = cache.favorites.find((f) => f.ol_work_id === book.olid)

      if (existing) {
        // Optimistic remove
        cache.favorites = cache.favorites.filter((f) => f.ol_work_id !== book.olid)
        notify()
        const res = await fetch(`/api/favorites/${existing.id}`, { method: 'DELETE' })
        if (!res.ok) {
          // revert
          cache.favorites = [...(cache.favorites ?? []), existing]
          notify()
        }
      } else {
        // Optimistic add (placeholder)
        const placeholder: Favorite = {
          id: 'pending',
          user_id: '',
          ol_work_id: book.olid,
          title: book.title,
          author: book.author,
          cover_url: book.coverUrl,
          created_at: new Date().toISOString(),
        }
        cache.favorites = [...(cache.favorites ?? []), placeholder]
        notify()

        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ olId: book.olid, title: book.title, author: book.author, coverUrl: book.coverUrl }),
        })

        if (res.ok) {
          const { favorite } = await res.json()
          cache.favorites = (cache.favorites ?? []).map((f) => (f.id === 'pending' ? favorite : f))
        } else {
          cache.favorites = (cache.favorites ?? []).filter((f) => f.id !== 'pending')
        }
        notify()
      }
    },
    []
  )

  return {
    favorites: cache.favorites ?? [],
    isFavorited,
    loading: cache.loading,
    toggle,
  }
}

async function fetchFavorites() {
  cache.loading = true
  notify()
  try {
    const res = await fetch('/api/favorites')
    if (res.ok) {
      const data = await res.json()
      cache.favorites = data.favorites
    }
  } finally {
    cache.loading = false
    notify()
  }
}

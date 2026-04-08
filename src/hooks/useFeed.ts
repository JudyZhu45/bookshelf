'use client'

import { useState, useEffect } from 'react'
import type { ActivityFeedItem } from '@/types/database'

export default function useFeed(initialItems: ActivityFeedItem[]) {
  const [items, setItems] = useState<ActivityFeedItem[]>(initialItems)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialItems.length === 20)
  const [loading, setLoading] = useState(false)

  async function loadMore() {
    if (loading || !hasMore) return
    setLoading(true)
    try {
      const nextPage = page + 1
      const res = await fetch(`/api/feed?page=${nextPage}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        setItems((prev) => [...prev, ...data.items])
        setPage(nextPage)
        setHasMore(data.items.length === 20)
      }
    } finally {
      setLoading(false)
    }
  }

  return { items, loadMore, hasMore, loading }
}

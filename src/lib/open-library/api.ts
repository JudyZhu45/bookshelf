import type { OLSearchResponse, OLWorkDetail, BookSummary, BookDetail, OLAuthor } from './types'

const BASE = 'https://openlibrary.org'
const COVERS = 'https://covers.openlibrary.org/b/id'

export function coverUrl(coverId: number | undefined, size: 'S' | 'M' | 'L' = 'M'): string | null {
  if (!coverId) return null
  return `${COVERS}/${coverId}-${size}.jpg`
}

export function olidFromKey(key: string): string {
  return key.replace('/works/', '')
}

export async function searchBooks(query: string, page = 1, limit = 20): Promise<{ books: BookSummary[]; total: number }> {
  const url = `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=${limit}&page=${page}&fields=key,title,author_name,cover_i,first_publish_year`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error('Failed to search books')
  const data: OLSearchResponse = await res.json()
  return {
    total: data.numFound,
    books: data.docs.map((doc) => ({
      olid: olidFromKey(doc.key),
      title: doc.title,
      author: doc.author_name?.[0] ?? null,
      coverUrl: coverUrl(doc.cover_i),
      firstPublishYear: doc.first_publish_year ?? null,
    })),
  }
}

export async function getBookDetail(olid: string): Promise<BookDetail> {
  const [workRes, authorsRes] = await Promise.allSettled([
    fetch(`${BASE}/works/${olid}.json`, { next: { revalidate: 3600 } }),
    fetch(`${BASE}/works/${olid}/authors.json`, { next: { revalidate: 3600 } }),
  ])

  if (workRes.status === 'rejected' || !workRes.value.ok) {
    throw new Error('Book not found')
  }

  const work: OLWorkDetail = await workRes.value.json()

  let authorName: string | null = null
  if (authorsRes.status === 'fulfilled' && authorsRes.value.ok) {
    const authData = await authorsRes.value.json()
    const firstAuthor: OLAuthor | undefined = authData?.[0]?.author
    if (firstAuthor) {
      const aRes = await fetch(`${BASE}${firstAuthor.key}.json`, { next: { revalidate: 3600 } })
      if (aRes.ok) {
        const a = await aRes.json()
        authorName = a.name ?? null
      }
    }
  }

  const rawDesc = work.description
  const description = typeof rawDesc === 'string' ? rawDesc : rawDesc?.value ?? null

  return {
    olid,
    title: work.title,
    author: authorName,
    coverUrl: coverUrl(work.covers?.[0]),
    firstPublishYear: null,
    description,
    subjects: work.subjects?.slice(0, 10) ?? [],
  }
}

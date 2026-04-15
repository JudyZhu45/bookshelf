import { searchBooks } from '@/lib/open-library/api'
import { getFavoriteCounts } from '@/lib/supabase/server'
import BookGrid from '@/components/books/BookGrid'
import SearchBar from '@/components/books/SearchBar'
import Link from 'next/link'

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '', page = '1' } = await searchParams
  const currentPage = Math.max(1, parseInt(page, 10) || 1)

  if (!q) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--da-gold-muted)', fontStyle: 'italic' }}>
        <p>Enter a search query to find books.</p>
      </div>
    )
  }

  const { books, total } = await searchBooks(q, currentPage)
  const counts = await getFavoriteCounts(books.map((b) => b.olid))
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <h1
          className="text-xl"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, color: 'var(--da-parchment)' }}
        >
          Results for &ldquo;{q}&rdquo;
          <span className="font-normal text-base ml-2" style={{ color: 'var(--da-gold-muted)' }}>
            ({total.toLocaleString()} books)
          </span>
        </h1>
      </div>

      <div className="max-w-sm">
        <SearchBar defaultValue={q} size="sm" />
      </div>

      <BookGrid books={books} counts={counts} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${currentPage - 1}`}
              className="da-btn text-sm px-4 py-2"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm" style={{ color: 'var(--da-gold-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${currentPage + 1}`}
              className="da-btn text-sm px-4 py-2"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

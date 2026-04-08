import { searchBooks } from '@/lib/open-library/api'
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
      <div className="text-center py-20 text-stone-500">
        <p>Enter a search query to find books.</p>
      </div>
    )
  }

  const { books, total } = await searchBooks(q, currentPage)
  const totalPages = Math.ceil(total / 20)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <h1 className="text-xl font-semibold">
          Results for &ldquo;{q}&rdquo;
          <span className="text-stone-400 font-normal text-base ml-2">({total.toLocaleString()} books)</span>
        </h1>
      </div>

      <div className="max-w-sm">
        <SearchBar defaultValue={q} size="sm" />
      </div>

      <BookGrid books={books} />

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 pt-4">
          {currentPage > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${currentPage - 1}`}
              className="px-4 py-2 border border-stone-300 rounded-full text-sm hover:bg-stone-100 transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-stone-500">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${currentPage + 1}`}
              className="px-4 py-2 border border-stone-300 rounded-full text-sm hover:bg-stone-100 transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

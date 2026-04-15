import type { BookSummary } from '@/lib/open-library/types'
import BookCard from './BookCard'

type Props = {
  books: BookSummary[]
  counts?: Record<string, number>
  showFavoriteButton?: boolean
}

export default function BookGrid({ books, counts, showFavoriteButton = true }: Props) {
  if (books.length === 0) {
    return (
      <p className="text-center py-12" style={{ color: 'var(--da-gold-muted)', fontStyle: 'italic' }}>
        No books found.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {books.map((book) => (
        <BookCard key={book.olid} {...book} showFavoriteButton={showFavoriteButton} favoriteCount={counts?.[book.olid]} />
      ))}
    </div>
  )
}

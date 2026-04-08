import type { Favorite } from '@/types/database'
import BookGrid from '@/components/books/BookGrid'
import type { BookSummary } from '@/lib/open-library/types'

type Props = {
  favorites: Favorite[]
}

export default function FavoritesList({ favorites }: Props) {
  if (favorites.length === 0) {
    return (
      <div className="text-center py-20 text-stone-500">
        <p className="text-lg">No favorites yet.</p>
        <p className="text-sm mt-1">Search for books and click the heart to save them here.</p>
      </div>
    )
  }

  const books: BookSummary[] = favorites.map((f) => ({
    olid: f.ol_work_id,
    title: f.title,
    author: f.author,
    coverUrl: f.cover_url,
    firstPublishYear: null,
  }))

  return <BookGrid books={books} showFavoriteButton={true} />
}

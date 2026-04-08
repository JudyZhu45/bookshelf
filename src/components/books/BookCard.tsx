import Link from 'next/link'
import Image from 'next/image'
import type { BookSummary } from '@/lib/open-library/types'
import FavoriteButton from '@/components/favorites/FavoriteButton'

type Props = BookSummary & {
  showFavoriteButton?: boolean
}

export default function BookCard({ olid, title, author, coverUrl, firstPublishYear, showFavoriteButton = true }: Props) {
  return (
    <div className="group relative flex flex-col bg-white border border-stone-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/books/${olid}`} className="flex flex-col flex-1">
        <div className="relative aspect-[2/3] bg-stone-100">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Cover of ${title}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-sm px-4 text-center">
              No cover
            </div>
          )}
        </div>
        <div className="p-3 flex-1">
          <h3 className="font-medium text-sm leading-snug line-clamp-2">{title}</h3>
          {author && <p className="text-xs text-stone-500 mt-1 truncate">{author}</p>}
          {firstPublishYear && (
            <p className="text-xs text-stone-400 mt-0.5">{firstPublishYear}</p>
          )}
        </div>
      </Link>
      {showFavoriteButton && (
        <div className="px-3 pb-3">
          <FavoriteButton olid={olid} title={title} author={author} coverUrl={coverUrl} />
        </div>
      )}
    </div>
  )
}

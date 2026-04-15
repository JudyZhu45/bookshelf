import Link from 'next/link'
import Image from 'next/image'
import type { BookSummary } from '@/lib/open-library/types'
import FavoriteButton from '@/components/favorites/FavoriteButton'

type Props = BookSummary & {
  showFavoriteButton?: boolean
  favoriteCount?: number
}

export default function BookCard({ olid, title, author, coverUrl, firstPublishYear, showFavoriteButton = true, favoriteCount }: Props) {
  return (
    <div className="parchment-card group relative flex flex-col overflow-hidden">
      <Link href={`/books/${olid}`} className="flex flex-col flex-1" style={{ textDecoration: 'none', color: 'var(--da-ink)' }}>
        <div className="relative aspect-[2/3]" style={{ background: 'var(--da-parchment-edge)' }}>
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={`Cover of ${title}`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm px-4 text-center" style={{ color: 'var(--da-ink-light)', fontStyle: 'italic' }}>
              No cover
            </div>
          )}
        </div>
        <div className="p-3 flex-1">
          <h3 className="text-sm leading-snug line-clamp-2" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, color: 'var(--da-ink)' }}>
            {title}
          </h3>
          {author && <p className="text-xs mt-1 truncate" style={{ color: 'var(--da-ink-light)', fontStyle: 'italic' }}>{author}</p>}
          {firstPublishYear && (
            <p className="text-xs mt-0.5" style={{ color: 'var(--da-amber)' }}>{firstPublishYear}</p>
          )}
          {favoriteCount != null && favoriteCount > 0 && (
            <p className="text-xs mt-1" style={{ color: 'var(--da-burgundy-light)' }}>&#9829; {favoriteCount} {favoriteCount === 1 ? 'person' : 'people'}</p>
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

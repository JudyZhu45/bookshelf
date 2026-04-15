import { getBookDetail } from '@/lib/open-library/api'
import { getFavoriteCounts } from '@/lib/supabase/server'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import FavoriteButton from '@/components/favorites/FavoriteButton'
import ReadingStatusPicker from '@/components/books/ReadingStatusPicker'

type Props = {
  params: Promise<{ olid: string }>
}

export default async function BookPage({ params }: Props) {
  const { olid } = await params

  let book
  try {
    book = await getBookDetail(olid)
  } catch {
    notFound()
  }

  const counts = await getFavoriteCounts([olid])
  const favoriteCount = counts[olid] ?? 0

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-8 flex-col sm:flex-row">
        <div className="shrink-0">
          <div
            className="relative w-40 h-56 overflow-hidden"
            style={{
              borderRadius: '3px',
              background: 'var(--da-parchment-edge)',
              boxShadow: '0 4px 16px rgba(10, 8, 5, 0.5), 0 2px 4px rgba(10, 8, 5, 0.3)',
            }}
          >
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                unoptimized
                className="object-cover"
                sizes="160px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-center px-4" style={{ color: 'var(--da-ink-light)', fontStyle: 'italic' }}>
                No cover
              </div>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <FavoriteButton
              olid={olid}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
            />
            <ReadingStatusPicker
              olid={olid}
              title={book.title}
              author={book.author}
              coverUrl={book.coverUrl}
            />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1
              className="text-3xl leading-tight"
              style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: 'var(--da-parchment)' }}
            >
              {book.title}
            </h1>
            {book.author && (
              <p className="text-lg mt-1" style={{ color: 'var(--da-gold-muted)', fontStyle: 'italic' }}>
                by {book.author}
              </p>
            )}
            {favoriteCount > 0 && (
              <p className="text-sm mt-2" style={{ color: 'var(--da-burgundy-light)' }}>
                &#9829; {favoriteCount} {favoriteCount === 1 ? 'person has' : 'people have'} favorited this
              </p>
            )}
          </div>

          {book.description && (
            <div>
              <h2
                className="text-xs mb-2"
                style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--da-gold-muted)' }}
              >
                About
              </h2>
              <p className="leading-relaxed text-sm" style={{ color: 'var(--da-cream)', lineHeight: 1.8 }}>
                {book.description}
              </p>
            </div>
          )}

          {book.subjects.length > 0 && (
            <div>
              <h2
                className="text-xs mb-2"
                style={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--da-gold-muted)' }}
              >
                Subjects
              </h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 text-xs"
                    style={{
                      background: 'rgba(61, 46, 30, 0.5)',
                      color: 'var(--da-cream)',
                      border: '1px solid var(--da-wood)',
                      borderRadius: '2px',
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

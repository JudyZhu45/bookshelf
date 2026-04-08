import { getBookDetail } from '@/lib/open-library/api'
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

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex gap-8 flex-col sm:flex-row">
        <div className="shrink-0">
          <div className="relative w-40 h-56 rounded-lg overflow-hidden bg-stone-100 shadow">
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={`Cover of ${book.title}`}
                fill
                className="object-cover"
                sizes="160px"
                priority
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-sm text-center px-4">
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
            <h1 className="text-3xl font-bold leading-tight">{book.title}</h1>
            {book.author && (
              <p className="text-lg text-stone-500 mt-1">by {book.author}</p>
            )}
          </div>

          {book.description && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-2">About</h2>
              <p className="text-stone-700 leading-relaxed text-sm">{book.description}</p>
            </div>
          )}

          {book.subjects.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-400 mb-2">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {book.subjects.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs"
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

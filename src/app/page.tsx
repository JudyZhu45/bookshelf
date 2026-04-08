import Link from 'next/link'
import SearchBar from '@/components/books/SearchBar'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-10 py-20">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">Discover Your Next Read</h1>
        <p className="text-lg text-stone-500 max-w-xl">
          Search millions of books, save your favorites, and see what the community is reading.
        </p>
      </div>

      <div className="w-full max-w-xl">
        <SearchBar size="lg" />
      </div>

      <div className="flex gap-4 text-sm text-stone-500">
        <Link href="/feed" className="hover:text-stone-800 underline underline-offset-2">
          Community feed
        </Link>
        <span>·</span>
        <Link href="/favorites" className="hover:text-stone-800 underline underline-offset-2">
          My favorites
        </Link>
      </div>
    </div>
  )
}

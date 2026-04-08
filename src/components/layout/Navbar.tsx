import Link from 'next/link'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import SearchBar from '@/components/books/SearchBar'

export default function Navbar() {
  return (
    <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link href="/" className="font-bold text-lg shrink-0">
          BookShelf
        </Link>

        <div className="flex-1 max-w-sm">
          <SearchBar size="sm" />
        </div>

        <nav className="flex items-center gap-4 ml-auto text-sm">
          <Show when="signed-in">
            <Link href="/feed" className="text-stone-600 hover:text-stone-900">
              Feed
            </Link>
            <Link href="/favorites" className="text-stone-600 hover:text-stone-900">
              Favorites
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="bg-stone-900 text-white px-4 py-1.5 rounded-full text-sm hover:bg-stone-700 transition-colors">
                Sign in
              </button>
            </SignInButton>
          </Show>
        </nav>
      </div>
    </header>
  )
}

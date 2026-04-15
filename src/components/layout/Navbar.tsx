import Link from 'next/link'
import { Show, SignInButton, UserButton } from '@clerk/nextjs'
import SearchBar from '@/components/books/SearchBar'

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b" style={{
      background: 'linear-gradient(180deg, rgba(26, 20, 16, 0.98) 0%, rgba(18, 16, 14, 0.95) 100%)',
      borderColor: 'var(--da-wood)',
      backdropFilter: 'blur(12px)',
    }}>
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        <Link
          href="/"
          className="shrink-0 tracking-wide"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--da-gold)',
            textDecoration: 'none',
          }}
        >
          BookShelf
        </Link>

        <div className="flex-1 max-w-sm">
          <SearchBar size="sm" />
        </div>

        <nav className="flex items-center gap-4 ml-auto text-sm">
          <Show when="signed-in">
            <Link href="/feed" className="da-link" style={{ fontSize: '0.875rem' }}>
              Feed
            </Link>
            <Link href="/favorites" className="da-link" style={{ fontSize: '0.875rem' }}>
              Favorites
            </Link>
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="da-btn da-btn-gold text-sm px-4 py-1.5 rounded-sm cursor-pointer">
                Sign in
              </button>
            </SignInButton>
          </Show>
        </nav>
      </div>
    </header>
  )
}

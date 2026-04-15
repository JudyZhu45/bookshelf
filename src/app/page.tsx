import Link from 'next/link'
import SearchBar from '@/components/books/SearchBar'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center gap-0 -mt-8">
      {/* ── Hero Section ── */}
      <section className="w-full flex flex-col items-center py-20 px-4 text-center">
        {/* Decorative flourish */}
        <div className="flicker mb-6" style={{ color: 'var(--da-gold-muted)', fontSize: '1.5rem', letterSpacing: '0.5em' }}>
          &#10053; &#10053; &#10053;
        </div>

        <h1
          className="fade-in text-4xl sm:text-5xl md:text-6xl leading-tight tracking-tight"
          style={{
            fontFamily: 'var(--font-playfair), Georgia, serif',
            fontWeight: 700,
            color: 'var(--da-parchment)',
            textShadow: '0 2px 20px rgba(184, 134, 11, 0.15)',
          }}
        >
          A Private Study<br />for Readers
        </h1>

        <p
          className="fade-in fade-in-delay-1 mt-6 max-w-lg text-base sm:text-lg leading-relaxed"
          style={{ color: 'var(--da-cream)', fontStyle: 'italic', opacity: 0.85 }}
        >
          Search millions of books, curate your collection, and discover
          what the community treasures &mdash; in the quiet of your own study.
        </p>

        {/* Search bar on parchment */}
        <div className="fade-in fade-in-delay-2 w-full max-w-xl mt-10">
          <SearchBar size="lg" />
        </div>

        {/* Nav links */}
        <div className="fade-in fade-in-delay-3 flex gap-6 mt-8 text-sm">
          <Link href="/feed" className="da-link" style={{ letterSpacing: '0.05em' }}>
            Community Feed
          </Link>
          <span style={{ color: 'var(--da-wood-light)' }}>&middot;</span>
          <Link href="/favorites" className="da-link" style={{ letterSpacing: '0.05em' }}>
            My Favorites
          </Link>
        </div>
      </section>

      {/* ── Decorative Divider ── */}
      <div className="da-divider w-full max-w-2xl my-4">
        <span style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}>Est. MMXXVI</span>
      </div>

      {/* ── Three Feature Cards ── */}
      <section className="fade-in fade-in-delay-3 w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 px-4">
        <FeatureCard
          icon="&#9998;"
          title="Discover"
          description="Search the Open Library's vast collection. Millions of titles at your fingertips, from ancient texts to modern prose."
        />
        <FeatureCard
          icon="&#9829;"
          title="Curate"
          description="Save the works that speak to you. Build a personal shelf that reflects your literary journey and intellectual pursuits."
        />
        <FeatureCard
          icon="&#9672;"
          title="Connect"
          description="See what fellow readers treasure. A quiet community feed where book lovers share their discoveries."
        />
      </section>

      {/* ── Quote Block ── */}
      <section className="fade-in fade-in-delay-4 w-full max-w-2xl mt-16 mb-8 px-4">
        <blockquote
          className="parchment-card px-8 py-10 text-center"
          style={{ position: 'relative' }}
        >
          {/* Wax seal decoration */}
          <div
            style={{
              position: 'absolute',
              top: '-14px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 40% 40%, var(--da-burgundy-light), var(--da-burgundy))',
              boxShadow: '0 2px 6px rgba(107, 45, 62, 0.4), inset 0 -1px 2px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.65rem',
              color: 'var(--da-parchment)',
            }}
          >
            B
          </div>

          <p
            className="text-lg sm:text-xl leading-relaxed"
            style={{
              fontFamily: 'var(--font-playfair), Georgia, serif',
              fontStyle: 'italic',
              color: 'var(--da-ink)',
              lineHeight: 1.8,
            }}
          >
            &ldquo;A reader lives a thousand lives before he dies.
            The man who never reads lives only one.&rdquo;
          </p>
          <footer className="mt-4 text-sm" style={{ color: 'var(--da-ink-light)', letterSpacing: '0.1em' }}>
            &mdash; George R.R. Martin
          </footer>
        </blockquote>
      </section>

      {/* ── Bottom Flourish ── */}
      <div className="flicker mb-12" style={{ color: 'var(--da-wood-light)', fontSize: '0.875rem', letterSpacing: '0.3em' }}>
        &#8943; &#10047; &#8943;
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="dark-card px-6 py-8 text-center flex flex-col items-center gap-3">
      <div
        className="flicker text-2xl"
        style={{ color: 'var(--da-gold)' }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <h3
        className="text-base tracking-wide"
        style={{
          fontFamily: 'var(--font-playfair), Georgia, serif',
          fontWeight: 600,
          color: 'var(--da-parchment)',
        }}
      >
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--da-cream)', opacity: 0.8 }}>
        {description}
      </p>
    </div>
  )
}

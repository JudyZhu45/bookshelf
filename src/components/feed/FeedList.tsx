import type { ActivityFeedItem } from '@/types/database'
import FeedItem from './FeedItem'

type Props = {
  items: ActivityFeedItem[]
}

export default function FeedList({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--da-gold-muted)' }}>
        <p className="text-lg" style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontStyle: 'italic' }}>
          Nothing in the feed yet.
        </p>
        <p className="text-sm mt-2" style={{ color: 'var(--da-cream)' }}>
          Start saving books and come back!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <FeedItem key={item.id} item={item} />
      ))}
    </div>
  )
}

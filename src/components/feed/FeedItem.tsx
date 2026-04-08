import Image from 'next/image'
import Link from 'next/link'
import type { ActivityFeedItem } from '@/types/database'

const ACTION_LABELS: Record<ActivityFeedItem['action'], string> = {
  favorited: 'saved',
  started_reading: 'started reading',
  finished: 'finished reading',
}

type Props = {
  item: ActivityFeedItem
}

export default function FeedItem({ item }: Props) {
  const label = ACTION_LABELS[item.action]
  const timeAgo = formatTimeAgo(item.created_at)

  return (
    <div className="flex gap-3 p-4 bg-white border border-stone-200 rounded-lg">
      <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 text-sm font-medium text-stone-600">
        {item.profile.avatar_url ? (
          <Image
            src={item.profile.avatar_url}
            alt={item.profile.username}
            width={32}
            height={32}
            className="rounded-full"
          />
        ) : (
          item.profile.username[0]?.toUpperCase()
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm">
          <span className="font-medium">{item.profile.username}</span>
          {' '}{label}{' '}
          <Link href={`/books/${item.ol_work_id}`} className="font-medium hover:underline">
            {item.title}
          </Link>
          {item.author && <span className="text-stone-500"> by {item.author}</span>}
        </p>
        <p className="text-xs text-stone-400 mt-0.5">{timeAgo}</p>
      </div>

      {item.cover_url && (
        <Link href={`/books/${item.ol_work_id}`} className="shrink-0">
          <div className="relative w-10 h-14">
            <Image
              src={item.cover_url}
              alt={item.title}
              fill
              className="object-cover rounded"
              sizes="40px"
            />
          </div>
        </Link>
      )}
    </div>
  )
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

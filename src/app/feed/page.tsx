import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import FeedList from '@/components/feed/FeedList'
import type { ActivityFeedItem } from '@/types/database'

export default async function FeedPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createServiceClient()

  const { data } = await supabase
    .from('activity_feed')
    .select('*, profile:profiles(username, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20)

  const items = (data as ActivityFeedItem[]) ?? []

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1
        className="text-2xl"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: 'var(--da-parchment)' }}
      >
        Community Feed
      </h1>
      <FeedList items={items} />
    </div>
  )
}

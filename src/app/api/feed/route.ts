import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20', 10))
  const offset = (page - 1) * limit

  const supabase = await createServiceClient()

  // Keep the current user's profile username in sync with Clerk
  const user = await currentUser()
  const displayName = user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || userId
  await supabase
    .from('profiles')
    .update({ username: displayName })
    .eq('clerk_id', userId)

  const { data, error } = await supabase
    .from('activity_feed')
    .select('*, profile:profiles(username, avatar_url)')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ items: data ?? [] })
}

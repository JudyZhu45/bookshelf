import { auth, currentUser } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { olId, status, title, author, coverUrl } = await req.json()
  if (!olId || !status || !title) return Response.json({ error: 'Missing fields' }, { status: 400 })

  const validStatuses = ['want_to_read', 'reading', 'finished']
  if (!validStatuses.includes(status)) return Response.json({ error: 'Invalid status' }, { status: 400 })

  const supabase = await createServiceClient()

  // Get display name from Clerk
  const user = await currentUser()
  const displayName = user?.username || user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || userId

  const { data: profile } = await supabase
    .from('profiles')
    .upsert({ clerk_id: userId, username: displayName }, { onConflict: 'clerk_id' })
    .select('id')
    .single()

  if (!profile) return Response.json({ error: 'Profile error' }, { status: 500 })

  const { data, error } = await supabase
    .from('reading_status')
    .upsert(
      {
        user_id: profile.id,
        ol_work_id: olId,
        title,
        author: author ?? null,
        cover_url: coverUrl ?? null,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,ol_work_id' }
    )
    .select()
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ status: data })
}

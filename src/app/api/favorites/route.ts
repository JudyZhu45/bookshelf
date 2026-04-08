import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = await createServiceClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!profile) return Response.json({ favorites: [] })

  const { data: favorites, error } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ favorites })
}

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { olId, title, author, coverUrl } = await req.json()
  if (!olId || !title) return Response.json({ error: 'Missing fields' }, { status: 400 })

  const supabase = await createServiceClient()

  // Upsert profile
  const { data: profile } = await supabase
    .from('profiles')
    .upsert({ clerk_id: userId, username: userId }, { onConflict: 'clerk_id' })
    .select('id')
    .single()

  if (!profile) return Response.json({ error: 'Profile error' }, { status: 500 })

  const { data: favorite, error } = await supabase
    .from('favorites')
    .insert({ user_id: profile.id, ol_work_id: olId, title, author: author ?? null, cover_url: coverUrl ?? null })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') return Response.json({ error: 'Already favorited' }, { status: 409 })
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ favorite }, { status: 201 })
}

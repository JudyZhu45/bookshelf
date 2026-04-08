import { auth } from '@clerk/nextjs/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const supabase = await createServiceClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!profile) return Response.json({ error: 'Not found' }, { status: 404 })

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id)
    .eq('user_id', profile.id)

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ success: true })
}

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { createServiceClient } from '@/lib/supabase/server'
import FavoritesList from '@/components/favorites/FavoritesList'
import type { Favorite } from '@/types/database'

export default async function FavoritesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const supabase = await createServiceClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_id', userId)
    .single()

  if (!profile) {
    return (
      <div className="text-center py-20" style={{ color: 'var(--da-gold-muted)', fontStyle: 'italic' }}>
        <p>No favorites yet. Search for books to get started!</p>
      </div>
    )
  }

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <h1
        className="text-2xl"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 700, color: 'var(--da-parchment)' }}
      >
        My Favorites
      </h1>
      <FavoritesList favorites={(favorites as Favorite[]) ?? []} />
    </div>
  )
}

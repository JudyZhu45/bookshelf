import { auth } from '@clerk/nextjs/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const { getToken } = await auth()
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => (await getToken({ template: 'supabase' })) ?? '',
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // called from server component — can be ignored if middleware refreshes sessions
          }
        },
      },
    }
  )
}

export async function getFavoriteCounts(olids: string[]): Promise<Record<string, number>> {
  if (olids.length === 0) return {}
  const supabase = await createServiceClient()
  const { data } = await supabase
    .from('favorites')
    .select('ol_work_id')
    .in('ol_work_id', olids)
  if (!data) return {}
  const counts: Record<string, number> = {}
  for (const row of data) {
    counts[row.ol_work_id] = (counts[row.ol_work_id] ?? 0) + 1
  }
  return counts
}

export async function createServiceClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

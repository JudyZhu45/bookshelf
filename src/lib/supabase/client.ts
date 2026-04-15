import { createBrowserClient } from '@supabase/ssr'

export function createClient(getToken: () => Promise<string | null>) {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      accessToken: async () => (await getToken()) ?? '',
    }
  )
}

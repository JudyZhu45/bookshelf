export type Profile = {
  id: string
  clerk_id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export type Favorite = {
  id: string
  user_id: string
  ol_work_id: string
  title: string
  author: string | null
  cover_url: string | null
  created_at: string
}

export type ReadingStatus = {
  id: string
  user_id: string
  ol_work_id: string
  title: string
  author: string | null
  cover_url: string | null
  status: 'want_to_read' | 'reading' | 'finished'
  updated_at: string
}

export type ActivityFeedItem = {
  id: string
  user_id: string
  action: 'favorited' | 'started_reading' | 'finished'
  ol_work_id: string
  title: string
  author: string | null
  cover_url: string | null
  created_at: string
  profile: {
    username: string
    avatar_url: string | null
  }
}

export type OLSearchDoc = {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
  subject?: string[]
}

export type OLSearchResponse = {
  numFound: number
  start: number
  docs: OLSearchDoc[]
}

export type OLWorkDetail = {
  key: string
  title: string
  description?: string | { value: string }
  subjects?: string[]
  covers?: number[]
}

export type OLAuthor = {
  name: string
  key: string
}

export type BookSummary = {
  olid: string
  title: string
  author: string | null
  coverUrl: string | null
  firstPublishYear: number | null
}

export type BookDetail = BookSummary & {
  description: string | null
  subjects: string[]
}

export interface AuthorDto {
  id: string
  name: string
  slug: string
  bio?: string
  imageUrl?: string
  website?: string
  booksCount: number
  isVerified: boolean
}

export interface GetAuthorsDto {
  q?: string      // Search query
  verified?: boolean
  limit?: number
  page?: number
  sort?: string   // name:asc, name:desc, booksCount:desc, etc.
}

export interface GetAuthorDto {
  slug: string
}

export interface AutocompleteAuthorsDto {
  q: string       // Required search query
  limit?: number
} 
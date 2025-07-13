import type { Author } from "@prisma/client"
import { prisma } from "../../infrastructure/config/prisma"
import * as constants from "../../core/constants"
import { NotFoundError, ServerError } from "../../core/errors"
import type {
  AuthorDto,
  GetAuthorsDto,
  GetAuthorDto,
  AutocompleteAuthorsDto
} from "./authors.dto"
import type { GetAuthorsResponse, AutocompleteAuthorsResponse } from "./authors.types"

export class AuthorsService {
  async getAuthors(props: GetAuthorsDto): Promise<GetAuthorsResponse> {
    try {
      const { q, verified, page = 1, limit = constants.DEFAULT_LIMIT, sort = 'name:asc' } = props
      
      // Build where clause
      let where: any = {}
      
      if (q) {
        where.name = {
          contains: q,
          mode: 'insensitive'
        }
      }
      
      if (verified !== undefined) {
        where.isVerified = verified
      }
      
      // Build pagination
      const take = Number(limit)
      const skip = (page - 1) * take
      
      // Build ordering
      const [field, order] = sort.split(':')
      const orderBy = { [field!]: order }
      
      const [data, totalResults] = await Promise.all([
        prisma.author.findMany({
          where,
          orderBy,
          skip,
          take,
        }),
        prisma.author.count({ where })
      ])
      
      const content: AuthorDto[] = data.map((author: Author) => ({
        id: author.id,
        name: author.name,
        slug: author.slug,
        bio: author.bio ?? undefined,
        imageUrl: author.imageUrl ?? undefined,
        website: author.website ?? undefined,
        booksCount: author.booksCount,
        isVerified: author.isVerified
      }))
      
      const result: GetAuthorsResponse = {
        content,
        page,
        resultsPerPage: take,
        totalResults
      }

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async getAuthor(props: GetAuthorDto): Promise<AuthorDto> {
    const { slug } = props

    try {
      const result = await prisma.author.findUnique({
        where: { slug }
      })

      if (!result) {
        throw new NotFoundError(
          Error(`Author with slug '${slug}' not found`)
        )
      }

      const author: AuthorDto = {
        id: result.id,
        name: result.name,
        slug: result.slug,
        bio: result.bio ?? undefined,
        imageUrl: result.imageUrl ?? undefined,
        website: result.website ?? undefined,
        booksCount: result.booksCount,
        isVerified: result.isVerified
      }

      return author
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new ServerError(error as Error)
    }
  }

  async autocompleteAuthors(props: AutocompleteAuthorsDto): Promise<AutocompleteAuthorsResponse> {
    try {
      const { q, limit = 10 } = props
      
      if (!q || q.trim().length < 2) {
        return { suggestions: [] }
      }
      
      // Search in both Author table and Book.author field for comprehensive results
      const [authorResults, bookAuthorResults] = await Promise.all([
        // Search in Author table
        prisma.author.findMany({
          where: {
            name: {
              contains: q.trim(),
              mode: 'insensitive'
            }
          },
          select: { name: true },
          orderBy: { booksCount: 'desc' },
          take: limit
        }),
        
        // Search in Book.author field for authors not yet in Author table
        prisma.book.findMany({
          where: {
            author: {
              contains: q.trim(),
              mode: 'insensitive'
            }
          },
          select: { author: true },
          distinct: ['author'],
          take: limit
        })
      ])
      
      // Combine and deduplicate results
      const authorNames = new Set<string>()
      
      // Add verified authors first (higher priority)
      authorResults.forEach(author => authorNames.add(author.name))
      
      // Add book authors
      bookAuthorResults.forEach(book => authorNames.add(book.author))
      
      // Convert to array and limit results
      const suggestions = Array.from(authorNames).slice(0, limit)
      
      return { suggestions }
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }
} 
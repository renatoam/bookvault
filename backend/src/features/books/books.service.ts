import { prisma } from "../../config/prisma";
import type {
  GetBooksDto,
  GetBooksResponse,
  CreateBookDto,
  GetBookDto,
  UpdateBookRequestDto,
} from "../../core/types/dtos/books";
import * as constants from "../../core/constants";
import { NotFoundError, ServerError } from "../../core/errors";
import { getBooksOrderBy, getBooksPagination, getBooksQuery } from "./books.helpers";
import type { Book } from "@prisma/client";
import { randomUUID } from "crypto";

export class BooksService {
  async getBooks(props: GetBooksDto): Promise<GetBooksResponse> {
    try {
      const where = getBooksQuery(props)
      const pagination = getBooksPagination(props)
      const orderBy = getBooksOrderBy(props)

      /**
       * TODO: Implement search query by similarity
       * 
       * const books = await prisma.$queryRaw`
          SELECT * FROM "Book"
          WHERE similarity(title, ${props.q}) > 0.3
          OR similarity(author, ${props.q}) > 0.3
          OR status = ${props.status}
          ORDER BY similarity(title, ${props.q}) DESC
          LIMIT ${props.limit}
        `;
       */

      const [data, totalResults] = await Promise.all([
        prisma.book.findMany({
          where,
          orderBy,
          ...pagination,
        }),
        prisma.book.count({ where })
      ])
      
      if (!data) {
        throw new NotFoundError(
          Error(constants.BOOK_NOT_FOUND_MESSAGE)
        )
      }

      const result: GetBooksResponse = {
        content: data,
        page: pagination.skip,
        resultsPerPage: pagination.take,
        totalResults
      }

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async createBook(props: CreateBookDto): Promise<Book> {
    const { title, author, status, description } = props

    try {
      const result = await prisma.book.create({
        data: {
          title,
          author,
          status,
          description,
          id: randomUUID(),
          user: {
            connectOrCreate: {
              create: {
                email: 'testing@email.com',
                name: 'Test User',
                passwordHash: '1234',
                id: '1234'
              },
              where: {
                id: '1234'
              }
            }
          }
        }
      })

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async getBook(props: GetBookDto): Promise<Book> {
    const { id } = props

    try {
      const result = await prisma.book.findUnique({
        where: { id }
      })

      if (!result) {
          throw new NotFoundError(
          Error(constants.BOOK_NOT_FOUND_MESSAGE)
        )
      }

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async updateBook(props: UpdateBookRequestDto): Promise<Book> {
    const { id, title, author, status, description } = props

    try {
      const result = await prisma.book.update({
        where: { id },
        data: { title, author, status, description }
      })

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async deleteBook(props: GetBookDto): Promise<void> {
    try {
      await prisma.book.delete({ where: { id: props.id } })
    } catch (error) {
      throw new ServerError(error as Error)
    }
  } 
}

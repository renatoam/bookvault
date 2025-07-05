import { Router, type Request, type Response } from "express";
import { prisma } from "../config/prisma";
import { randomUUID } from "node:crypto";
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import { NotFoundError, ServerError } from "../core/errors";
import { successResponseHandler } from "../config/http/httpSuccessResponseHandler";
import { HTTP_STATUS_CODE } from "../config/http/httpResponseHandlers";
import type { UpsertBookRequest, SearchRequest } from "../config/http/httpTypes";
import * as constants from "../core/constants";
import { searchBooksValidation, bodyBookValidation, validateIncomingId } from "../middlewares";

export const booksRouter = Router()

booksRouter.get('/', searchBooksValidation, async (
  request: SearchRequest,
  response: Response
) => {
  const errorHandler = errorResponseHandler(response)
  const successHandler = successResponseHandler(response)
  const {
    q,
    author,
    status,
    page,
    limit,
    orderBy
  } = request.query
  let where

  if (q) {
    where = {
      OR: [
        { title: { contains: q, mode: 'insensitive' } as const },
        { author: { contains: q, mode: 'insensitive' } as const }
      ]
    }
  }

  // const books = await prisma.$queryRaw`
  //   SELECT * FROM "Book"
  //   WHERE similarity(title, ${q}) > 0.3
  //   ORDER BY similarity(title, ${q}) DESC
  //   LIMIT 20
  // `;

  if (author) {
    where = { ...where, author }
  }

  if (status) {
    where = { ...where, status }
  }

  try {
    const [data, totalResults] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: page ? ((page - 1) * (limit ?? constants.DEFAULT_LIMIT) ): undefined,
        take: page ? Number(limit ?? constants.DEFAULT_LIMIT) : constants.DEFAULT_LIMIT,
        orderBy: orderBy ? { [orderBy.field]: orderBy?.order } : undefined
      }),
      prisma.book.count({ where })
    ])
    
    if (!data) {
      const serverError = new ServerError(
        Error(constants.SOMETHING_WENT_WRONG_MESSAGE)
      )
      return errorHandler(serverError)
    }

    const result = {
      content: data,
      page,
      resultsPerPage: limit,
      totalResults
    }

    return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

booksRouter.post('/new', bodyBookValidation, async (
  request: UpsertBookRequest,
  response: Response
) => {
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const {
    title,
    author,
    status,
    description
  } = request.body

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

    return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

booksRouter.get('/:id', validateIncomingId, async (
  request: Request<{ id: string }>,
  response: Response
) => {
  const { id } = request.params
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  
  try {
    const result = await prisma.book.findUnique({
      where: {
        id
      }
    })

    if (!result) {
      const notFoundError = new NotFoundError(Error(constants.BOOK_NOT_FOUND_MESSAGE))
      return errorHandler(notFoundError)
    }

    return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

booksRouter.put('/:id', validateIncomingId, bodyBookValidation, async (
  request: Request,
  response: Response
) => {
  const { id } = request.params
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  
  try {
    const result = await prisma.book.findUnique({
      where: {
        id
      }
    })

    if (!result) {
      const notFoundError = new NotFoundError(Error(constants.BOOK_NOT_FOUND_MESSAGE))
      return errorHandler(notFoundError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  try {
    const result = await prisma.book.update({
      where: {
        id
      },
      data: request.body
    })

    return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

booksRouter.delete('/:id', validateIncomingId, async (
  request: Request<{ id: string }>,
  response: Response
) => {
  const { id } = request.params
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  
  try {
    const result = await prisma.book.findUnique({
      where: {
        id
      }
    })

    if (!result) {
      const notFoundError = new NotFoundError(Error(constants.BOOK_NOT_FOUND_MESSAGE))
      return errorHandler(notFoundError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  try {
    await prisma.book.delete({
      where: {
        id
      }
    })
    
    return successHandler(HTTP_STATUS_CODE.NO_CONTENT)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

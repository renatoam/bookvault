import { Router, type Request, type Response } from "express";
import { prisma } from "../config/prisma";
import { randomUUID } from "node:crypto";
import { createBookValidation } from "../middlewares/bookBodyValidation";
import { validateIncomingId } from "../middlewares/incomingIdValidation";
import { errorResponseHandler } from "../config/httpErrorResponseHandler";
import { NotFoundError, ServerError } from "../errors";
import { successResponseHandler } from "../config/httpSuccessResponseHandler";
import { HTTP_STATUS_CODE } from "../config/httpResponseHandlers";

export const booksRouter = Router()

interface Book {
  id?: string
  title: string
  author: string
  status: 'WISHLIST' | 'READING' | 'FINISHED'
  description?: string
}

booksRouter.get('/', async (_request: Request, response: Response) => {
  const errorHandler = errorResponseHandler(response)
  const successHandler = successResponseHandler(response)

  try {
    const data = await prisma.book.findMany()
    
    if (!data) {
      const serverError = new ServerError(
        Error('Something went wrong when retrieving books.')
      )
      return errorHandler(serverError)
    }

    return successHandler(HTTP_STATUS_CODE.SUCCESS, data)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

booksRouter.post('/new', createBookValidation, async (
  request: Request,
  response: Response
) => {
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const {
    title,
    author,
    status,
    description
  } = (request.body ?? {}) as Book

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
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const { id } = request.params
  
  try {
    const result = await prisma.book.findUnique({
      where: {
        id
      }
    })

    if (!result) {
      const notFoundError = new NotFoundError(Error('Book not found.'))
      return errorHandler(notFoundError)
    }

    return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

booksRouter.put('/:id', validateIncomingId, async (request: Request, response: Response) => {
  console.log(request.body)
  return response.status(200).json('Book Success')
})

booksRouter.delete('/:id', async (request: Request, response: Response) => {
  console.log(request.headers)
  return response.status(200).json('Book Success')
})

booksRouter.patch('/:id', async (request: Request, response: Response) => {
  console.log(request.body)
  return response.status(200).json('Book Success')
})

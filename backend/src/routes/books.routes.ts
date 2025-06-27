import { Router, type Request, type Response } from "express";
import { prisma } from "../config/prisma";
import { randomUUID } from "node:crypto";
import { createBookValidation } from "../middlewares/bodyValidation";

export const booksRouter = Router()

interface Book {
  id?: string
  title: string
  author: string
  status: 'WISHLIST' | 'READING' | 'FINISHED'
  description?: string
}

booksRouter.get('/', async (_request: Request, response: Response) => {
  try {
    const data = await prisma.book.findMany()
    
    if (!data || data.length === 0) {
      return response.status(404).json({
        error: 'Not found',
        message: 'No book found for this user.'
      })
    }

    return response.status(200).json({
      data,
      message: 'Books successfully retrieved.'
    })
  } catch (error) {
    console.error({ error })
    return response.status(500).json({
      error: 'Server error',
      message: 'Something went wrong when creating the book.'
    })
  }
})

booksRouter.post('/new', createBookValidation, async (request: Request, response: Response) => {
  const { title, author, status, description } = (request.body ?? {}) as Book

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

    console.log({ result })
    return response.status(201).json({
      data: result,
      message: 'Book successfully created.'
    })
  } catch (error) {
    console.error({ error })
    return response.status(500).json({
      error: 'Server error',
      message: 'Something went wrong when creating the book.'
    })
  }
})

booksRouter.put('/:id', async (request: Request, response: Response) => {
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

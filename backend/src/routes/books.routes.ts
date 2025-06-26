import { Router, type Request, type Response } from "express";

export const booksRouter = Router()

booksRouter.get('/', async (request: Request, response: Response) => {
  console.log(request.headers)
  return response.status(200).json('Book Success')
})

booksRouter.post('/', async (request: Request, response: Response) => {
  console.log(request.body)
  return response.status(200).json('Book Success')
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

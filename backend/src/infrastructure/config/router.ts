import { Router, type Request, type Response } from "express";
import { limiter } from "./rateLimit";
import { authRouter } from "../../features/auth/auth.routes";
import { booksRouter } from "../../features/books/books.routes";
import { authorsRouter } from "../../features/authors/authors.routes";

export const router = Router()

// Private routes
router.use('/books', booksRouter)

// Public routes
router.use('/auth', limiter, authRouter)
router.use('/authors', authorsRouter)

router.all('/', limiter, (request: Request, response: Response) => {
  if (request.method !== 'GET') {
    return response.status(403).json('[v1] Invalid method.')
  }

  return response.status(200).json('Try our auth and books endpoints.')
})

import { Router, type Request, type Response } from "express";
import { limiter } from "../config/rateLimit";
import { authRouter } from "./auth.routes";
import { booksRouter } from "./books.routes";

export const router = Router()

// Public routes
router.use('/v1', limiter, (_: Request, response: Response) => {
  return response.json('Try our auth and books endpoints.')
})

router.use('/', limiter, (_: Request, response: Response) => {
  return response.json('Try our v1 endpoints.')
})

router.use('/auth', limiter, authRouter)

// Private routes
router.use('/books', booksRouter)

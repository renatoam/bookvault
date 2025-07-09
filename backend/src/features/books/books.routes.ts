import { Router, type Request, type Response } from "express";
import { BooksController } from "./books.controller";
import {
  authenticate,
  bodyBookValidation,
  searchBooksValidation,
  validateIncomingId  
} from "../../infrastructure/middlewares";
import { BooksService } from "./books.service";

export const booksRouter = Router()

const init = (method: keyof BooksController) => {
  return async (request: Request, response: Response) => {
    const booksService = new BooksService()
    const booksController = new BooksController(booksService)

    return booksController[method](request, response)
  }
}

booksRouter.get('/', authenticate, searchBooksValidation, init('getBooks'))
booksRouter.post('/new', authenticate, bodyBookValidation, init('createBook'))
booksRouter.get('/:id', authenticate, validateIncomingId, init('getBook'))
booksRouter.put('/:id', authenticate, validateIncomingId, bodyBookValidation, init('updateBook'))
booksRouter.delete('/:id', authenticate, validateIncomingId, init('deleteBook'))

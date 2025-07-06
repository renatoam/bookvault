import { Router } from "express";
import { BooksController } from "./books.controller";
import {
  bodyBookValidation,
  searchBooksValidation,
  validateIncomingId  
} from "../../middlewares";
import { BooksService } from "./books.service";

export const booksRouter = Router()

const booksService = new BooksService()
const booksController = new BooksController(booksService)

booksRouter.get('/', searchBooksValidation, booksController.getBooks)
booksRouter.post('/new', bodyBookValidation, booksController.createBook)
booksRouter.get('/:id', validateIncomingId, booksController.getBook)
booksRouter.put('/:id', validateIncomingId, bodyBookValidation, booksController.updateBook)
booksRouter.delete('/:id', validateIncomingId, booksController.deleteBook)

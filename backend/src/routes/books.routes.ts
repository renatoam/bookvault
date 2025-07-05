import { Router } from "express";
import { BooksController } from "../features/books/books.controller";
import {
  bodyBookValidation,
  searchBooksValidation,
  validateIncomingId  
} from "../middlewares";

export const booksRouter = Router()

booksRouter.get('/', searchBooksValidation, new BooksController().getBooks)
booksRouter.post('/new', bodyBookValidation, new BooksController().createBook)
booksRouter.get('/:id', validateIncomingId, new BooksController().getBook)
booksRouter.put('/:id', validateIncomingId, bodyBookValidation, new BooksController().updateBook)
booksRouter.delete('/:id', validateIncomingId, new BooksController().deleteBook)

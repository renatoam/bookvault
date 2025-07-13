import { Router, type Request, type Response } from "express"
import { AuthorsController } from "./authors.controller"
import { AuthorsService } from "./authors.service"
import {
  searchAuthorsValidation,
  authorSlugValidation,
  autocompleteValidation
} from "../../infrastructure/middlewares/authorsValidation"

export const authorsRouter = Router()

const init = (method: keyof AuthorsController) => {
  return async (request: Request, response: Response) => {
    const authorsService = new AuthorsService()
    const authorsController = new AuthorsController(authorsService)

    return authorsController[method](request, response)
  }
}

// Public routes - no authentication required for authors
authorsRouter.get('/', searchAuthorsValidation, init('getAuthors'))
authorsRouter.get('/autocomplete', autocompleteValidation, init('autocompleteAuthors'))
authorsRouter.get('/:slug', authorSlugValidation, init('getAuthor')) 
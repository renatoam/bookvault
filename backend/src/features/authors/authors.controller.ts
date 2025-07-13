import type { Request, Response } from "express"
import { errorResponseHandler } from "../../infrastructure/http/httpErrorResponseHandler"
import { HTTP_STATUS_CODE } from "../../infrastructure/http/httpResponseHandlers"
import { successResponseHandler } from "../../infrastructure/http/httpSuccessResponseHandler"
import { AuthorsService } from "./authors.service"
import type { 
  GetAuthorsRequest, 
  GetAuthorRequest, 
  AutocompleteAuthorsRequest 
} from "./authors.types"

export class AuthorsController {
  private readonly authorsService: AuthorsService

  constructor(authorsService: AuthorsService) {
    this.authorsService = authorsService
  }

  async getAuthors(request: Request, response: Response) {
    const { query } = request as unknown as GetAuthorsRequest
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)
  
    try {
      const result = await this.authorsService.getAuthors(query)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async getAuthor(request: Request, response: Response) {
    const { params } = request as unknown as GetAuthorRequest
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      const result = await this.authorsService.getAuthor(params)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async autocompleteAuthors(request: Request, response: Response) {
    const { query } = request as unknown as AutocompleteAuthorsRequest
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)
  
    try {
      const result = await this.authorsService.autocompleteAuthors(query)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }
} 
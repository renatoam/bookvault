import type { Request, Response } from "express";
import { errorResponseHandler } from "../../config/http/httpErrorResponseHandler";
import { HTTP_STATUS_CODE } from "../../config/http/httpResponseHandlers";
import { successResponseHandler } from "../../config/http/httpSuccessResponseHandler";
import type { SearchRequest, UpsertBookRequest } from "../../config/http/httpTypes";
import { BooksService } from "./books.service";

export class BooksController {
  private readonly booksService: BooksService

  constructor(booksService: BooksService) {
    this.booksService = booksService
  }

  async getBooks(request: SearchRequest, response: Response) {
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)
  
    try {
      const result = await this.booksService.getBooks(request.query)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async createBook(request: UpsertBookRequest, response: Response) {
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
  
    try {
      const result = await this.booksService.createBook(request.body)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async getBook(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      const result = await this.booksService.getBook({ id })
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async updateBook(request: UpsertBookRequest, response: Response) {
    const { id } = request.params
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      await this.booksService.getBook({ id })
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    try {
      const result = await this.booksService.updateBook(request.body)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async deleteBook(request: Request<{ id: string }>, response: Response) {
    const { id } = request.params
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      await this.booksService.getBook({ id })
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    try {
      await this.booksService.deleteBook({ id }) 
      return successHandler(HTTP_STATUS_CODE.NO_CONTENT)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }
}

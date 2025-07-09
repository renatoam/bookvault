import type { Request, Response } from "express";
import { errorResponseHandler } from "../../infrastructure/http/httpErrorResponseHandler";
import { HTTP_STATUS_CODE } from "../../infrastructure/http/httpResponseHandlers";
import { successResponseHandler } from "../../infrastructure/http/httpSuccessResponseHandler";
import { BooksService } from "./books.service";
import type { CreateBookRequest, GetBookRequest, GetBooksRequest, UpsertBookRequest } from "./books.types";

export class BooksController {
  private readonly booksService: BooksService

  constructor(booksService: BooksService) {
    this.booksService = booksService
  }

  async getBooks(request: Request, response: Response) {
    const { query } = request as unknown as GetBooksRequest
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)
  
    try {
      const result = await this.booksService.getBooks(query)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async createBook(request: Request, response: Response) {
    const { body } = request as CreateBookRequest
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
  
    try {
      const result = await this.booksService.createBook(body)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async getBook(request: Request, response: Response) {
    const { params } = request as unknown as GetBookRequest
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      const result = await this.booksService.getBook(params)
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async updateBook(request: Request, response: Response) {
    const { params, body } = request as unknown as UpsertBookRequest
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      await this.booksService.getBook(params)
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    try {
      const result = await this.booksService.updateBook({ ...body, id: params.id })
      return successHandler(HTTP_STATUS_CODE.SUCCESS, result)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async deleteBook(request: Request, response: Response) {
    const { params } = request as unknown as GetBookRequest
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    
    try {
      await this.booksService.getBook(params)
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    try {
      await this.booksService.deleteBook(params) 
      return successHandler(HTTP_STATUS_CODE.NO_CONTENT)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }
}

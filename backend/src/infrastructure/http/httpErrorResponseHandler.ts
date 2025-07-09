import { type Response } from "express"
import type { ErrorBody } from "../../core/errors"
import {
  badRequest,
  conflict,
  notFound,
  serverError,
  serviceUnavailable
} from "./httpResponseHandlers"

export function errorResponseHandler(
  response: Response
): (error: Error) => Response<ErrorBody> {
  return (error: Error): Response<ErrorBody> => {
    const badRequestResponse = badRequest(error)
    const conflictError = conflict(error)
    const notFoundErrorResponse = notFound(error)
    const serverErrorResponse = serverError(error)
    const databaseErrorResponse = serviceUnavailable(error)

    switch (error.name) {
      case 'ClientError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(badRequestResponse.statusCode)
          .json(badRequestResponse.body)
      
      case 'ConflictError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(conflictError.statusCode)
          .json(conflictError.body)
      
      case 'NotFoundError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(notFoundErrorResponse.statusCode)
          .json(notFoundErrorResponse.body)
      
      case 'DatabaseError':
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(databaseErrorResponse.statusCode)
          .json(databaseErrorResponse.body)
      
      case 'QueryError':
      default:
        console.error(`${error.name}: ${error.message}`)
        return response
          .status(serverErrorResponse.statusCode)
          .json(serverErrorResponse.body)
    }
  }
}

import { type Response } from "express"
import { created, HTTP_STATUS_CODE, noContent, ok } from "./httpResponseHandlers"

export function successResponseHandler<T>(
  response: Response<T>
): (code: number, data: T) => Response<T> {
  return (code: number, data: T): Response<T> => {
    const successResponse = ok(data)
    const createdResponse = created(data)
    const noContentResponse = noContent()

    switch (code) {
      case HTTP_STATUS_CODE.SUCCESS:
        return response
          .status(successResponse.statusCode)
          .json(successResponse.body)
      case HTTP_STATUS_CODE.CREATED:
        return response
          .status(createdResponse.statusCode)
          .json(createdResponse.body)
      case HTTP_STATUS_CODE.NO_CONTENT:
        return response
          .status(noContentResponse.statusCode)
          .json()
      default:
        return response
          .status(code)
          .json(data)
    }
  }
}

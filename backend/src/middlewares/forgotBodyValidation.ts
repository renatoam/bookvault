import { z } from "zod"
import type { NextFunction, Request, Response } from "express"
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler"
import { ClientError, getErrorMessage } from "../errors"

export const forgotSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim()
})

export const forgotBodyValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = forgotSchema.safeParse(request.body)

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const clientError = new ClientError(
      Error(errorMessage)
    )
    return errorHandler(clientError)
  }

  request.body = parseResult.data

  next()
}

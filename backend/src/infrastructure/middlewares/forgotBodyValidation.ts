import type { NextFunction, Request, Response } from "express"
import { z } from "zod"
import * as constants from "../../core/constants"
import { ClientError, getErrorMessage } from "../../core/errors"
import { errorResponseHandler } from "../http/httpErrorResponseHandler"

export const forgotSchema = z.object({
  email: z
    .string()
    .email(constants.INVALID_EMAIL_MESSAGE)
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

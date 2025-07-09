import { type NextFunction, type Request, type Response } from "express"
import { z } from "zod"
import { ClientError, getErrorMessage } from "../../core/errors"
import { errorResponseHandler } from "../http/httpErrorResponseHandler"

const schema = z.object({
  id: z.string().uuid()
})

export function validateIncomingId(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const errorHandler = errorResponseHandler(response)
  const parseResult = schema.safeParse(request.params)

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}

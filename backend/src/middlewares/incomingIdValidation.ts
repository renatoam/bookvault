import { type Request, type Response, type NextFunction } from "express"
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler"
import { ClientError, getErrorMessage } from "../core/errors"
import { z } from "zod"

const schema = z.object({
  id: z.string().uuid()
})

export function validateIncomingId(
  request: Request<{ id: string }>,
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

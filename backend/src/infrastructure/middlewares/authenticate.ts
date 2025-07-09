import type { NextFunction, Request, Response } from "express"
import { jwtVerify } from "jose"
import * as constants from "../../core/constants"
import { ServerError, UnauthorizedError } from "../../core/errors"
import { errorResponseHandler } from "../http/httpErrorResponseHandler"

export const authenticate = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const authorization = request.get('Authorization')
  const token = authorization?.split(' ')[1] ?? ''

  if (!authorization || !token || !authorization.startsWith('Bearer ')) {
    const unauthorizedError = new UnauthorizedError(
      Error(constants.INVALID_OR_MISSING_TOKEN_MESSAGE)
    )
    return errorHandler(unauthorizedError)
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  let userId = null
  
  try {
    const { payload } = await jwtVerify(token, secret)
    userId = payload.sub
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  request.body = {
    ...request.body,
    id: userId,
    secret
  }

  next()
}

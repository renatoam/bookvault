import type { NextFunction, Request, Response } from "express"
import { jwtVerify } from "jose"
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler"
import { UnauthorizedError } from "../errors"

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
      Error('Invalid or missing token')
    )
    return errorHandler(unauthorizedError)
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const { payload } = await jwtVerify(token, secret)

  request.body = {
    id: payload.sub,
    secret
  }

  next()
}

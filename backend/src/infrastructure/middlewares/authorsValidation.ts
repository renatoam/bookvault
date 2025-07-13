import { type NextFunction, type Request, type Response } from "express"
import { z } from "zod"
import * as constants from "../../core/constants"
import { ClientError, getErrorMessage } from "../../core/errors"
import { errorResponseHandler } from "../http/httpErrorResponseHandler"
import type { ParsedQs } from "qs"

// Schema for author search
const searchAuthorsSchema = z.object({
  q: z.string().trim().max(100).optional().default(''),
  verified: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(constants.DEFAULT_LIMIT),
  sort: z.string().regex(/^(name|booksCount):(asc|desc)$/i).optional().default('name:asc')
})

// Schema for author slug validation
const authorSlugSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Invalid slug format")
})

// Schema for autocomplete
const autocompleteSchema = z.object({
  q: z.string().trim().min(2, "Query must be at least 2 characters").max(100),
  limit: z.coerce.number().int().min(1).max(20).optional().default(10)
})

export const searchAuthorsValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = searchAuthorsSchema.safeParse(request.query)

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  request.query = parseResult.data as unknown as ParsedQs
  next()
}

export const authorSlugValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = authorSlugSchema.safeParse(request.params)

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}

export const autocompleteValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = autocompleteSchema.safeParse(request.query)

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  request.query = parseResult.data as unknown as ParsedQs
  next()
} 
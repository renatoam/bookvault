import { type NextFunction, type Response } from "express";
import { z } from "zod";
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import type { SearchRequest } from "../config/http/httpTypes";
import { ClientError, getErrorMessage } from "../errors";
import { statusEnum } from "./helpers";

export const DEFAULT_LIMIT = 8

const searchSchema = z.object({
  q: z.string().trim().max(100).optional().default(''),
  author: z.string().trim().max(100).optional().default(''),
  status: statusEnum.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(DEFAULT_LIMIT),
  sort: z.string().regex(/^(title|author|status):(asc|desc)$/i).optional().default('title:asc')
});

export const searchBooksValidation = async (
  request: SearchRequest,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = searchSchema.safeParse(request.query)

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  const { sort, ...rest } = parseResult.data
  const orderBy = sort ? {
    field: sort.split(':')[0]!,
    order: sort.split(':')[1]!
  } : undefined

  request.query = {
    ...rest,
    orderBy
  }

  next()
}

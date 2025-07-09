import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import * as constants from "../../core/constants";
import { ClientError, getErrorMessage } from "../../core/errors";
import { errorResponseHandler } from "../http/httpErrorResponseHandler";
import { statusEnum } from "./helpers";
import type { ParsedQs } from "qs";

const searchSchema = z.object({
  q: z.string().trim().max(100).optional().default(''),
  author: z.string().trim().max(100).optional().default(''),
  status: statusEnum.optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(constants.DEFAULT_LIMIT),
  sort: z.string().regex(/^(title|author|status):(asc|desc)$/i).optional().default('title:asc')
});

export const searchBooksValidation = async (
  request: Request,
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

  request.query = parseResult.data as unknown as ParsedQs

  next()
}

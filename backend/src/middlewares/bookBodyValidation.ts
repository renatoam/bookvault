import { type NextFunction, type Response } from "express";
import { z } from "zod";
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import type { UpsertBookRequest } from "../config/http/httpTypes";
import { ClientError, getErrorMessage } from "../core/errors";
import { statusEnum } from "./helpers";
import * as constants from "../core/constants";

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, constants.TITLE_REQUIRED_MESSAGE),
  author: z.string().min(1, constants.AUTHOR_REQUIRED_MESSAGE),
  status: statusEnum,
  description: z.string().min(1, constants.DESCRIPTION_REQUIRED_MESSAGE),
});

export const bodyBookValidation = async (
  request: UpsertBookRequest,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = bookSchema.safeParse(request.body);

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}

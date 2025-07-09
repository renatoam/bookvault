import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import * as constants from "../../core/constants";
import { ClientError, getErrorMessage } from "../../core/errors";
import { errorResponseHandler } from "../http/httpErrorResponseHandler";
import { statusEnum } from "./helpers";

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, constants.TITLE_REQUIRED_MESSAGE),
  author: z.string().min(1, constants.AUTHOR_REQUIRED_MESSAGE),
  status: statusEnum,
  description: z.string().min(1, constants.DESCRIPTION_REQUIRED_MESSAGE),
});

export const bodyBookValidation = async (
  request: Request,
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

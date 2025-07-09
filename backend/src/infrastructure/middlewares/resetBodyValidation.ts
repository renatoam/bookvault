import type { NextFunction, Request, Response } from "express"
import { z } from "zod"
import * as constants from "../../core/constants"
import { ClientError, getErrorMessage } from "../../core/errors"
import { errorResponseHandler } from "../http/httpErrorResponseHandler"

export const resetSchema = z.object({
  token:
    z.string()
    .min(64, constants.RESET_TOKEN_MIN_LENGTH_MESSAGE),
  password: z
    .string()
    .min(8, constants.PASSWORD_MIN_LENGTH_MESSAGE)
    .max(100, constants.PASSWORD_MAX_LENGTH_MESSAGE)
    .regex(/[A-Z]/, constants.PASSWORD_UPPERCASE_LETTER_MESSAGE)
    .regex(/[a-z]/, constants.PASSWORD_LOWERCASE_LETTER_MESSAGE)
    .regex(/\d/, constants.PASSWORD_NUMBER_MESSAGE)
    .regex(/[^A-Za-z0-9]/, constants.PASSWORD_SPECIAL_CHARACTER_MESSAGE),
  confirmPassword: z
    .string()
    .min(8, constants.CONFIRM_PASSWORD_MIN_LENGTH_MESSAGE),
}).refine((data) => data.password === data.confirmPassword, {
  message: constants.PASSWORDS_DO_NOT_MATCH_MESSAGE,
  path: [constants.CONFIRM_PASSWORD_PATH],
});

export const resetBodyValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = resetSchema.safeParse(request.body)

  if (!parseResult.success) {
    const message = getErrorMessage(parseResult.error.issues)
    const clientError = new ClientError(
      Error(message)
    )
    return errorHandler(clientError)
  }

  next()
}

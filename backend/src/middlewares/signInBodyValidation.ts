import { type NextFunction, type Response } from "express";
import { z } from "zod";
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import { ClientError, getErrorMessage } from "../errors";
import type { SignInRequest } from "../config/http/httpTypes";

export const signInSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .trim(),
  password: z
    .string()
})

export const signInBodyValidation = async (
  request: SignInRequest,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = signInSchema.safeParse(request.body);

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}

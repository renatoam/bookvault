import { z } from "zod";
import type { NextFunction, Request, Response } from "express"
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import { ClientError, getErrorMessage } from "../errors";

export const resetSchema = z.object({
  token:
    z.string()
    .min(64, "Reset token must be at least 64 characters."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be at most 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
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

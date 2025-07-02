import { type NextFunction, type Response } from "express";
import { z } from "zod";
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import { ClientError, getErrorMessage } from "../errors";
import type { SignUpRequest } from "../config/http/httpTypes";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters")
    .trim()
    .optional(),
  email: z
    .string()
    .email("Invalid email address")
    .max(100, "Email must be at most 100 characters")
    .trim(),
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

export const signUpBodyValidation = async (
  request: SignUpRequest,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = signUpSchema.safeParse(request.body);

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}

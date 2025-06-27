import { type Request, type Response, type NextFunction } from "express"
import { z } from "zod";
import { ClientError, getErrorMessage } from "../errors";
import { errorResponseHandler } from "../config/httpErrorResponseHandler";

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required."),
  status: z.enum(['WISHLIST', 'READING', 'FINISHED']),
  description: z.string().min(1, "Description is required."),
});

export const createBookValidation = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const errorHandler = errorResponseHandler(response)
  const parseResult = bookSchema.safeParse(request.body);

  console.log({ body: request.body })

  if (!parseResult.success) {
    const errorMessage = getErrorMessage(parseResult.error.issues)
    const badRequestError = new ClientError(Error(errorMessage))
    return errorHandler(badRequestError)
  }

  next()
}

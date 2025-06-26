import { type Request, type Response, type NextFunction } from "express"
import { z } from "zod";

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  status: z.enum(['WISHLIST', 'READING', 'FINISHED']).optional(),
  description: z.string().optional(),
});

export const createBookValidation = async (request: Request, response: Response, next: NextFunction) => {
  const parseResult = bookSchema.safeParse(request.body);

  console.log({ body: request.body })

  if (!parseResult.success) {
    return response.status(400).json({
      error: 'Validation error',
      message: parseResult.error.issues
        .map(issue => issue.message)
        .join('; '),
    });
  }

  next()
}

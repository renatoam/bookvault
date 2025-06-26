import { z } from "zod";
import type { Book } from "../services/createBook";
import { useState } from "react";

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  author: z.string().optional(),
  status: z.enum(['WISHLIST', 'READING', 'FINISHED']).optional(),
  description: z.string().optional(),
});

export const useBookValidation = () => {
  const [errors, setErrors] = useState<Book | null>(null)

  const validate = (book: Book) => {
    const parseResult = bookSchema.safeParse(book);

    if (!parseResult.success) {
      const issues = parseResult.error.issues
        .reduce((acc, issue) => {
          const key = issue.path[0]
          return {
            ...acc,
            [key]: issue.message
          }
        }, {} as Book)
      
      setErrors(issues)
      return false
    }

    setErrors(null)
    return true
  }

  return {
    validate,
    errors
  }
}

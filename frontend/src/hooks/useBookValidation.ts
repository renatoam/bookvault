import { z, ZodSchema } from "zod";
import { useState } from "react";
import type { Book } from "../types/book";

const titleSchema = z.string().min(1, "Title is required")
const authorSchema = z.string().min(1, "Author is required")
const descriptionSchema = z.string()
  .min(3, "Description is required")
  .max(200, "Max of 200 characters allowed.")
const statusSchema = z.enum(['WISHLIST', 'READING', 'FINISHED'])

export const bookSchema = z.object({
  id: z.string().optional(),
  title: titleSchema,
  author: authorSchema,
  status: statusSchema,
  description: descriptionSchema,
});

type ValidationResult = {
  valid: true,
  data: Book[keyof Book]
} | {
  valid: false,
  issues: string
}

const fieldValueValidation = (value: unknown, schema: ZodSchema): ValidationResult => {
  const result = schema.safeParse(value)

  if (!result.success) {
    const issues = result.error.issues
      .map(issue => issue.message)
      .join('; ')
    return {
      issues,
      valid: false
    }
  }

  return {
    valid: true,
    data: result.data
  }
}

const validateFieldMap:
  Record<keyof Omit<Book, "id">,
  (value: unknown) => ValidationResult> = {
  title: (value: unknown) => fieldValueValidation(value, titleSchema),
  author: (value: unknown) => fieldValueValidation(value, authorSchema),
  status: (value: unknown) => fieldValueValidation(value, statusSchema),
  description: (value: unknown) => fieldValueValidation(value, descriptionSchema),
}

export const useBookValidation = () => {
  const [errors, setErrors] = useState<Partial<Book> | null>(null)

  const validateField = (field: keyof Omit<Book, "id">, value: unknown) => {
    const validation = validateFieldMap[field](value)

    if (validation.valid) {
      setErrors(current => ({
        ...current,
        [field]: null
      }))
      return validation.data
    }

    setErrors(current => ({
      ...current,
      [field]: validation.issues
    }))
  }

  const validateForm = (book: Book) => {
    const parseResult = bookSchema.safeParse(book);

    if (!parseResult.success) {
      const issues = parseResult.error.issues
        .reduce((acc, issue) => {
          const key = issue.path[0] as keyof Book
          const value = issue.message
          return {
            ...acc,
            [key]: value
          }
        }, {} as Book)
      
      setErrors(issues)
      return false
    }

    setErrors(null)
    return true
  }

  return {
    validateField,
    validateForm,
    errors
  }
}

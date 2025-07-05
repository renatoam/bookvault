import type { ZodIssue } from "zod"

export const getErrorMessage = (issues: ZodIssue[]): string => {
  return issues
    .flatMap(issue => `[${issue.path}]: ${issue.message}`)
    .join('; ')
}

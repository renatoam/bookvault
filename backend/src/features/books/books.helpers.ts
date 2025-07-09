import * as constants from "../../core/constants"
import type { GetBooksDto } from "./books.dto"

export const getBooksQuery = (props: GetBooksDto) => {
  const { q, author, status } = props
  let where = {}

  if (q) {
    where = {
      OR: [
        { title: { contains: q, mode: 'insensitive' } as const },
        { author: { contains: q, mode: 'insensitive' } as const }
      ]
    }
  }

  if (author) {
    where = { ...where, author }
  }

  if (status) {
    where = { ...where, status }
  }

  return where
}

export const getBooksPagination = (props: GetBooksDto) => {
  const { page, limit } = props

  const take = Number(limit ?? constants.DEFAULT_LIMIT)
  const skip = page ? (page - 1) * take : 0
  
  return {
    skip,
    take
  }
}

export const getBooksOrderBy = (props: GetBooksDto) => {
  const { sort } = props

  if (!sort) return undefined
  
  const orderBy = {
    field: sort.split(':')[0]!,
    order: sort.split(':')[1]!
  }

  return { [orderBy.field]: orderBy?.order }
}

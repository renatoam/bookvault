import {
  ClientError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ServerError,
  DatabaseError,
  type ErrorBody
} from "../../errors"

export const HTTP_STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
}

export interface HttpHelperResponse<T = unknown> {
  statusCode: number
  body: T
}

export const ok = <T>(data: T): HttpHelperResponse<T> => ({
  statusCode: 200,
  body: data
})

export const created = <T>(data: T): HttpHelperResponse<T> => ({
  statusCode: 201,
  body: data
})

export const noContent = (): HttpHelperResponse => ({
  statusCode: 204,
  body: null
})

export const badRequest = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ClientError(error)

  return {
    statusCode: 400,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const unauthorized = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new UnauthorizedError(error)

  return {
    statusCode: 401,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const forbidden = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ForbiddenError(error)

  return {
    statusCode: 403,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const notFound = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new NotFoundError(error)

  return {
    statusCode: 404,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const conflict = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ConflictError(error)

  return {
    statusCode: 409,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const serverError = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new ServerError(error)

  return {
    statusCode: 500,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

export const serviceUnavailable = (error?: Error): HttpHelperResponse<ErrorBody> => {
  const customError = new DatabaseError(error)

  return {
    statusCode: 503,
    body: {
      ...customError,
      name: customError.name,
      message: customError.message,
    }
  }
}

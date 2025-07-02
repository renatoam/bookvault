import argon from "argon2";
import { Router, type Request, type Response } from "express";
import { SignJWT } from "jose";
import { randomBytes, randomUUID } from "node:crypto";
import { errorResponseHandler } from "../config/http/httpErrorResponseHandler";
import { HTTP_STATUS_CODE } from "../config/http/httpResponseHandlers";
import { successResponseHandler } from "../config/http/httpSuccessResponseHandler";
import type { ResetPasswordRequest, SignInRequest, SignUpRequest } from "../config/http/httpTypes";
import { prisma } from "../config/prisma";
import { ConflictError, ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from "../errors";
import { authenticate } from "../middlewares/authenticate";
import { forgotBodyValidation } from "../middlewares/forgotBodyValidation";
import { resetBodyValidation } from "../middlewares/resetBodyValidation";
import { signInBodyValidation } from "../middlewares/signInBodyValidation";
import { signUpBodyValidation } from "../middlewares/signUpBodyValidation";
import { Resend } from "resend";

export const authRouter = Router()

const MAX_AGE = 1000 * 60 * 60 * 24 * 7
const AVG_AGE = 1000 * 60 * 15

authRouter.get('/health', async (request: Request, response: Response) => {
  console.log(request.headers)
  return response.status(200).json('Check success')
})

authRouter.post('/signin', signInBodyValidation, async (
  request: SignInRequest,
  response: Response
) => {
  const { email, password } = request.body
  const errorHandler = errorResponseHandler(response)
  const successHandler = successResponseHandler(response)
  let user = null

  try {
    user = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (!user) {
      const notFoundError = new NotFoundError(
        Error("User not found.")
      )
      return errorHandler(notFoundError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  try {
    const userId = user.id
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const accessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15 min')
      .setSubject(userId)
      .sign(secret)
    const isPasswordValid = await argon.verify(user.passwordHash, password)

    if (!isPasswordValid) {
      const unauthorizedError = new UnauthorizedError(
        Error('Invalid password.')
      )
      return errorHandler(unauthorizedError)
    }

    const { passwordHash, ...nonSensitiveUserData } = user
    const data = {
      user: nonSensitiveUserData,
      auth: {
        accessToken,
        expiresIn: AVG_AGE
      }
    }

    const ipAddress = request.ip ?? request.socket.remoteAddress
    const userAgent = request.get('user-agent') ?? request.header('user-agent') ?? request.headers['user-agent']
    const refreshTokenOpaque = randomBytes(48).toString('hex')
    const { token: refreshToken } = await prisma.refreshToken.create({
      data: {
        expiresAt: new Date(Date.now() + MAX_AGE),
        token: refreshTokenOpaque,
        createdAt: new Date(Date.now()),
        ipAddress,
        userAgent,
        userId,
      }
    })

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: MAX_AGE
    })

    return successHandler(HTTP_STATUS_CODE.CREATED, data)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

authRouter.post('/signup', signUpBodyValidation, async (
  request: SignUpRequest,
  response: Response
) => {
  const { email, password, name } = request.body
  const errorHandler = errorResponseHandler(response)
  const successHandler = successResponseHandler(response)

  try {
    const result = await prisma.user.findFirst({
      where: {
        email
      }
    })

    if (result) {
      const conflictError = new ConflictError(
        Error("Email already in use.")
      )
      return errorHandler(conflictError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  try {    
    const userId = randomUUID()
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const accessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15 min')
      .setSubject(userId)
      .sign(secret)
    const passwordHash = await argon.hash(password)
    const atIndex = email.indexOf('@')
    const placeholderName = email.slice(0, atIndex)

    const { passwordHash: ignorePassword, ...result } = await prisma.user.create({
      data: {
        email,
        name: name ?? placeholderName,
        passwordHash,
        id: userId
      }
    })

    const data = {
      user: result,
      auth: {
        accessToken,
        expiresIn: AVG_AGE
      }
    }

    const ipAddress = request.ip ?? request.socket.remoteAddress
    const userAgent = request.get('user-agent') ?? request.header('user-agent') ?? request.headers['user-agent']
    const refreshTokenOpaque = randomBytes(48).toString('hex')
    const { token: refreshToken } = await prisma.refreshToken.create({
      data: {
        expiresAt: new Date(Date.now() + MAX_AGE),
        token: refreshTokenOpaque,
        createdAt: new Date(Date.now()),
        ipAddress,
        userAgent,
        userId,
      }
    })

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
      maxAge: MAX_AGE
    })

    return successHandler(HTTP_STATUS_CODE.CREATED, data)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

authRouter.post('/signout', authenticate, async (
  request: Request,
  response: Response
) => {
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const { id } = request.body
  const { refresh_token } = request.cookies

  try {
    await prisma.refreshToken.deleteMany({
      where: {
        AND: [
          {
            userId: id,
            token: refresh_token
          }
        ]
      }
    })

    response.clearCookie('refresh_token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/auth/refresh',
    })

    return successHandler(HTTP_STATUS_CODE.NO_CONTENT)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

authRouter.post('/refresh', async (request: Request, response: Response) => {
  const errorHandler = errorResponseHandler(response)
  const successHandler = successResponseHandler(response)
  const refreshToken = request.cookies.refresh_token
  const ipAddress = request.ip ?? request.socket.remoteAddress
  const userAgent = request.get('user-agent') ?? request.header('user-agent') ?? request.headers['user-agent']
  let token = null
  let user = null

  if (!refreshToken) {
    const unauthorizedError = new UnauthorizedError(
      Error('Invalid or inexistent refresh token')
    )
    return errorHandler(unauthorizedError)
  }
  
  try {
    token = await prisma.refreshToken.findUnique({
      where: {
        token: refreshToken
      }
    })
    
    if (!token || token.revokedAt || token.expiresAt < new Date()) {
      const unauthorizedError = new UnauthorizedError(
        Error('Invalid or expired refresh token')
      )
      return errorHandler(unauthorizedError)
    }
  
    if (token.ipAddress !== ipAddress || token.userAgent !== userAgent) {
      const forbiddenError = new ForbiddenError(
        Error('You are not allowed to access this session with the current device')
      )
      return errorHandler(forbiddenError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  try {
    user = await prisma.user.findUnique({
      where: {
        id: token.userId
      }
    })
  
    if (!user) {
      const unauthorizedError = new UnauthorizedError(
        Error('No user associated with this token')
      )
      return errorHandler(unauthorizedError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  const secret = new TextEncoder().encode(process.env.JWT_SECRET)
  const accessToken = await new SignJWT({ userId: user.id })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15 min')
    .setSubject(user.id)
    .sign(secret)

  const { passwordHash, ...noSensitiveUserData } = user
  const data = {
    user: noSensitiveUserData,
    auth: {
      accessToken,
      expiresIn: AVG_AGE
    }
  }

  return successHandler(HTTP_STATUS_CODE.SUCCESS, data)
})

authRouter.get('/me', authenticate, async (
  request: Request,
  response: Response
) => {
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const { id, secret } = request.body

  try {
    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })

    if (!user) {
      const notFoundError = new NotFoundError(
        Error("User not found.")
      )
      return errorHandler(notFoundError)
    }

    const accessToken = await new SignJWT({ userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('15 min')
      .setSubject(user.id)
      .sign(secret)

    const { passwordHash, ...noSensitiveUserData } = user
    const data = {
      user: noSensitiveUserData,
      auth: {
        accessToken,
        expiresIn: AVG_AGE
      }
    }

    return successHandler(HTTP_STATUS_CODE.SUCCESS, data)
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

authRouter.post('/forgot-password', forgotBodyValidation, async(
  request: Request,
  response: Response
) => {
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const { email } = request.body
  let user = null

  try {
    user = await prisma.user.findUnique({
      where: {
        email
      }
    })

    if (!user) {
      const notFoundError = new NotFoundError(
        Error('User not found.')
      )
      return errorHandler(notFoundError)
    }
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }

  const token = randomBytes(32).toString('hex')

  try {
    await prisma.passwordResetToken.create({
      data: {
        expiresAt: new Date(Date.now() + AVG_AGE),
        token,
        userId: user.id
      }
    })

    const resend = new Resend(process.env.RESEND_KEY);
    await resend.emails.send({
      from: `${process.env.EMAIL_SUBJECT} <${process.env.EMAIL_SENDER}>`,
      to: [email],
      subject: 'Reset Password',
      html: `<strong>
        <a target="_blank" href="${process.env.FRONTEND_RESET_ROUTE}?token=${token}">
          Reset
        </a>
      </strong>`,
    });

    return successHandler(HTTP_STATUS_CODE.SUCCESS, "You'll receive instructions via email.")
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

authRouter.post('/reset-password', resetBodyValidation, async(
  request: ResetPasswordRequest,
  response: Response
) => {
  const successHandler = successResponseHandler(response)
  const errorHandler = errorResponseHandler(response)
  const { token, password } = request.body

  try {
    const reset = await prisma.passwordResetToken.findUnique({
      where: {
        token
      }
    })

    if (!reset || reset.expiresAt < new Date() || reset.usedAt) {
      const unauthorizedError = new UnauthorizedError(
        Error('Invalid or expired token')
      )
      return errorHandler(unauthorizedError)
    }

    const passwordHash = await argon.hash(password)

    await prisma.user.update({
      where: {
        id: reset.userId,
      },
      data: {
        passwordHash
      }
    })

    await prisma.passwordResetToken.update({
      where: {
        id: reset.id
      },
      data: {
        usedAt: new Date()
      }
    })

    return successHandler(HTTP_STATUS_CODE.SUCCESS, "Password reset successful")
  } catch (error) {
    const serverError = new ServerError(error as Error)
    return errorHandler(serverError)
  }
})

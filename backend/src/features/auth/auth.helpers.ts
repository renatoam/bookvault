import argon from "argon2"
import { SignJWT } from "jose"
import { randomBytes } from "node:crypto"
import type { SignInRequest, SignUpRequest } from "../../config/http/httpTypes"
import * as constants from "../../core/constants"
import { ServerError, UnauthorizedError } from "../../core/errors"
import type { User } from "@prisma/client"

export const generateAccessToken = async (userId: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const accessToken = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('15 min')
      .setIssuedAt()
      .setSubject(userId)
      .sign(secret)
  
    return {
      accessToken,
      expiresIn: constants.AVG_AGE
    }
  } catch (error) {
    throw new ServerError(error as Error)
  }
}

export interface CreateRefreshTokenData {
  expiresAt: Date
  token: string
  createdAt: Date
  ipAddress: string
  userAgent: string
}

export interface ConfigRefreshTokenData {
  tokenName: string
  httpOnly: boolean
  secure: boolean
  sameSite: string
  path: string
  maxAge: number
}

export type GenerateRefreshTokenResponse = {
  createData: CreateRefreshTokenData
  configData: ConfigRefreshTokenData
}

export const generateRefreshToken = (
  request: SignUpRequest | SignInRequest
): GenerateRefreshTokenResponse => {
  const { ipAddress, userAgent } = getDeviceInfo(request)
  const refreshTokenOpaque = randomBytes(48).toString('hex')
  const expiresAt = new Date(Date.now() + constants.MAX_AGE)

  const createData: CreateRefreshTokenData = {
    expiresAt,
    token: refreshTokenOpaque,
    createdAt: new Date(Date.now()),
    ipAddress,
    userAgent,
  }

  const configData: ConfigRefreshTokenData = {
    tokenName: constants.REFRESH_TOKEN_COOKIE_NAME,
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: constants.REFRESH_TOKEN_COOKIE_PATH,
    maxAge: constants.MAX_AGE
  }

  return {
    createData,
    configData
  }
}

export const validatePassword = async (password: string, user: User) => {
  const { passwordHash, ...userData } = user
  try {
    const isPasswordValid = await argon.verify(passwordHash, password)

    if (!isPasswordValid) {
      throw new UnauthorizedError(
        Error(constants.INVALID_PASSWORD_MESSAGE)
      )
    }

    return userData
  } catch (error) {
    throw new UnauthorizedError(error as Error)
  }
}

export interface DeviceInfo {
  ipAddress: string
  userAgent: string
}

export const getDeviceInfo = (request: SignUpRequest | SignInRequest): DeviceInfo => {
  const ipAddress = request.ip ?? request.socket?.remoteAddress ?? ''
  const userAgent = request.get('user-agent') ?? request.header('user-agent') ?? request.headers['user-agent'] ?? ''
  return {
    ipAddress,
    userAgent
  }
}

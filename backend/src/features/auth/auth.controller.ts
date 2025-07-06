import type { RefreshToken, User } from "@prisma/client";
import argon from "argon2";
import type { CookieOptions, Request, Response } from "express";
import { errorResponseHandler } from "../../config/http/httpErrorResponseHandler";
import { HTTP_STATUS_CODE } from "../../config/http/httpResponseHandlers";
import { successResponseHandler } from "../../config/http/httpSuccessResponseHandler";
import type { SignInRequest, SignUpRequest } from "../../config/http/httpTypes";
import * as constants from "../../core/constants";
import { UnauthorizedError } from "../../core/errors";
import type { SignedUserResponseDto } from "../../core/types/dtos/auth";
import { generateAccessToken, generateRefreshToken, getDeviceInfo, validatePassword } from "./auth.helpers";
import { AuthService } from "./auth.service";

export class AuthController {
  private readonly authService: AuthService

  constructor(authService: AuthService) {
    this.authService = authService
  }

  async signUp(request: SignUpRequest, response: Response) {
    const { email, password, name } = request.body
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)

    try {
      await this.authService.getUserByEmail(email, true)
    } catch (error) {
      return errorHandler(error as Error)
    }

    try {
      const passwordHash = await argon.hash(password)
      const user = await this.authService.createUser({ email, passwordHash, name })
      const auth = await generateAccessToken(user.id)      

      const data: SignedUserResponseDto = {
        user,
        auth
      }

      const { configData, createData } = generateRefreshToken(request)
      await this.authService.createRefreshToken(user.id, createData)

      response.cookie(
        configData.tokenName,
        createData.token,
        { ...configData } as CookieOptions
      )

      return successHandler(HTTP_STATUS_CODE.CREATED, data)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async signIn(request: SignInRequest, response: Response) {
    const { email, password } = request.body
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)
    let user = null

    try {
      user = await this.authService.getUserByEmail(email)
    } catch (error) {
      return errorHandler(error as Error)
    }

    try {
      const auth = await generateAccessToken(user.id)
      const userData = await validatePassword(password, user)

      const data: SignedUserResponseDto = {
        user: userData,
        auth
      }

      const { configData, createData } = generateRefreshToken(request)
      await this.authService.createRefreshToken(user.id, createData)

      response.cookie(
        configData.tokenName,
        createData.token, { ...configData } as CookieOptions
      )

      return successHandler(HTTP_STATUS_CODE.CREATED, data)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async signOut(request: Request, response: Response) {
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    const { id } = request.body
    const { [constants.REFRESH_TOKEN_COOKIE_NAME]: refreshToken } = request.cookies

    try {
      await this.authService.deleteRefreshToken(id, refreshToken)
      const { configData } = generateRefreshToken(request)
      response.clearCookie(configData.tokenName, { ...configData } as CookieOptions)

      return successHandler(HTTP_STATUS_CODE.NO_CONTENT)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async refresh(request: Request, response: Response) {
    const errorHandler = errorResponseHandler(response)
    const successHandler = successResponseHandler(response)
    const refreshToken = request.cookies[constants.REFRESH_TOKEN_COOKIE_NAME]
    const { ipAddress, userAgent } = getDeviceInfo(request)
    let token: RefreshToken | null = null
    let user: User | null = null
  
    if (!refreshToken) {
      const unauthorizedError = new UnauthorizedError(
        Error(constants.INVALID_OR_EXISTENT_REFRESH_TOKEN_MESSAGE)
      )
      return errorHandler(unauthorizedError)
    }
    
    try {
      token = await this.authService.getRefreshToken(refreshToken, { ipAddress, userAgent })
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    try {
      user = await this.authService.getUserById(token.userId)
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    const auth = await generateAccessToken(user.id)
    const { passwordHash, ...noSensitiveUserData } = user
    const data: SignedUserResponseDto = {
      user: noSensitiveUserData,
      auth
    }

    try {
      const { configData, createData } = generateRefreshToken(request)
      await this.authService.createRefreshToken(user.id, createData)
  
      response.cookie(
        configData.tokenName,
        createData.token,
        { ...configData } as CookieOptions
      )
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    return successHandler(HTTP_STATUS_CODE.SUCCESS, data)
  }

  async forgotPassword(request: Request, response: Response) {
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    const { email } = request.body
    let user: User
  
    try {
      user = await this.authService.getUserByEmail(email)
    } catch (error) {
      return errorHandler(error as Error)
    }
  
    try {
      const token = await this.authService.createPasswordResetToken(user.id)
      await this.authService.sendResetPasswordEmail(email, token)  
      return successHandler(HTTP_STATUS_CODE.SUCCESS, constants.RESET_PASSWORD_INSTRUCTIONS_MESSAGE)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async resetPassword(request: Request, response: Response) {
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    const { token, password } = request.body
  
    try {
      const passwordHash = await argon.hash(password)
      const reset = await this.authService.getPasswordResetToken(token)
      await this.authService.updateUserPassword(reset.userId, passwordHash)
      await this.authService.invalidatePasswordResetToken(reset.id)
  
      return successHandler(HTTP_STATUS_CODE.SUCCESS, constants.RESET_PASSWORD_SUCCESS_MESSAGE)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }

  async me(request: Request, response: Response) {
    const successHandler = successResponseHandler(response)
    const errorHandler = errorResponseHandler(response)
    const { id } = request.body
  
    try {
      const user = await this.authService.getUserById(id)
      const auth = await generateAccessToken(user.id)
  
      const { passwordHash, ...noSensitiveUserData } = user
      const data: SignedUserResponseDto = {
        user: noSensitiveUserData,
        auth
      }
  
      return successHandler(HTTP_STATUS_CODE.SUCCESS, data)
    } catch (error) {
      return errorHandler(error as Error)
    }
  }
}

import { randomBytes, randomUUID } from "node:crypto";
import { prisma } from "../../config/prisma";
import * as constants from "../../core/constants";
import { ConflictError, ForbiddenError, NotFoundError, ServerError, UnauthorizedError } from "../../core/errors";
import type { CreateUserDto } from "../../core/types/dtos/auth";
import { type CreateRefreshTokenData, type DeviceInfo } from "./auth.helpers";
import type { PasswordResetToken, RefreshToken, User } from "@prisma/client";
import { Resend } from "resend";

export class AuthService {
  async createUser(props: CreateUserDto) {
    const { email, passwordHash, name = '' } = props
    const userId = randomUUID()
    const atIndex = email.indexOf('@')
    const placeholderName = email.slice(0, atIndex)

    try {
      const { passwordHash: ignorePassword, ...result } = await prisma.user.create({
        data: {
          email,
          name: name ?? placeholderName,
          passwordHash,
          id: userId
        }
      })
  
      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async getUserByEmail(email: string, validateEquality: boolean = false): Promise<User> {
    try {
      const result = await prisma.user.findFirst({
        where: {
          email
        }
      })

      if (result && validateEquality) {
        throw new ConflictError(
          Error(constants.EMAIL_ALREADY_IN_USE_MESSAGE)
        )
      }

      if (!result) {
        throw new NotFoundError(
          Error(constants.USER_NOT_FOUND_MESSAGE)
        )
      }

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const result = await prisma.user.findUnique({
        where: { id }
      })

      if (!result) {
        throw new NotFoundError(
          Error(constants.USER_NOT_FOUND_MESSAGE)
        )
      }

      return result
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      })
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async createRefreshToken(
    userId: string,
    tokenData: CreateRefreshTokenData
  ) {
    try {
      const { token: refreshToken } = await prisma.refreshToken.create({
        data: {
          ...tokenData,
          userId,
        }
      })
  
      return refreshToken
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async deleteRefreshToken(userId: string, refreshToken: string) {
    try {
      await prisma.refreshToken.deleteMany({
        where: {
          userId,
          token: refreshToken
        }
      })
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async getRefreshToken(refreshToken: string, deviceInfo: DeviceInfo): Promise<RefreshToken> {
    const { ipAddress, userAgent } = deviceInfo
    
    try {
      const token = await prisma.refreshToken.findUnique({
        where: {
          token: refreshToken
        }
      })
      
      if (!token || token.revokedAt || token.expiresAt < new Date()) {
        throw new UnauthorizedError(
          Error(constants.INVALID_OR_EXPIRED_REFRESH_TOKEN_MESSAGE)
        )
      }
    
      if (token.ipAddress !== ipAddress || token.userAgent !== userAgent) {
        throw new ForbiddenError(
          Error(constants.FORBIDDEN_DEVICE_ACCESS_MESSAGE)
        )
      }

      return token
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async createPasswordResetToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex')
    
    try {
      await prisma.passwordResetToken.create({
        data: {
          expiresAt: new Date(Date.now() + constants.AVG_AGE),
          token,
          userId
        }
      })

      return token
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken> {
    try {
      const reset = await prisma.passwordResetToken.findUnique({
        where: {
          token
        }
      })
  
      if (!reset || reset.expiresAt < new Date() || reset.usedAt) {
        throw new UnauthorizedError(
          Error(constants.INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN_MESSAGE)
        )
      }

      return reset
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async invalidatePasswordResetToken(id: number): Promise<void> {
    try {
      await prisma.passwordResetToken.update({
        where: { id },
        data: { usedAt: new Date() }
      })
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`
    const subject = 'Reset your password'
    const text = `Click here to reset your password: ${resetPasswordUrl}`
    const html = `<strong>
        <a target="_blank" href="${resetPasswordUrl}">
          ${text}
        </a>
      </strong>`

    try {
      const resend = new Resend(process.env.RESEND_KEY);
      await resend.emails.send({
        from: `${process.env.EMAIL_SUBJECT} <${process.env.EMAIL_SENDER}>`,
        to: [email],
        subject,
        html,
      });
    } catch (error) {
      throw new ServerError(error as Error)
    }
  }
}

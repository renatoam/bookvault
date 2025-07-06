import type { User } from "@prisma/client"

export interface CreateUserDto {
  email: string
  passwordHash: string
  name?: string
}

export interface SignedUserResponseDto {
  user: Omit<User, 'passwordHash'>
  auth: {
    accessToken: string
    expiresIn: number
  }
}

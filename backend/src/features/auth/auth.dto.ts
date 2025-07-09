export interface CreateUserDto {
  email: string
  passwordHash: string
  name?: string
}

export interface GetUserResponseDto {
  email: string
  name: string
  id: string
  passwordHash?: string
}

export interface SignedUserResponseDto {
  user: GetUserResponseDto
  auth: {
    accessToken: string
    expiresIn: number
  }
}

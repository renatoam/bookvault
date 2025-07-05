export const MAX_AGE = 1000 * 60 * 60 * 24 * 7
export const AVG_AGE = 1000 * 60 * 15
export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token"
export const REFRESH_TOKEN_COOKIE_PATH = "/auth/refresh"

// Messages
export const USER_NOT_FOUND_MESSAGE = "User not found."
export const INVALID_PASSWORD_MESSAGE = "Invalid password."
export const INVALID_EMAIL_MESSAGE = "Invalid email address."
export const EMAIL_ALREADY_IN_USE_MESSAGE = "Email already in use."
export const EMAIL_MAX_LENGTH_MESSAGE = "Email must be at most 100 characters."
export const NAME_MIN_LENGTH_MESSAGE = "Name must be at least 2 characters."
export const NAME_MAX_LENGTH_MESSAGE = "Name must be at most 50 characters."

export const INVALID_OR_EXISTENT_REFRESH_TOKEN_MESSAGE = "Invalid or inexistent refresh token."
export const INVALID_OR_EXPIRED_REFRESH_TOKEN_MESSAGE = "Invalid or expired refresh token."
export const INVALID_OR_EXPIRED_PASSWORD_RESET_TOKEN_MESSAGE = "Invalid or expired password reset token."
export const INVALID_OR_MISSING_TOKEN_MESSAGE = "Invalid or missing token."
export const FORBIDDEN_DEVICE_ACCESS_MESSAGE = "You are not allowed to access this session with the current device."
export const NO_USER_ASSOCIATED_MESSAGE = "'No user associated with this token."
export const RESET_TOKEN_MIN_LENGTH_MESSAGE = "Reset token must be at least 64 characters."

export const RESET_PASSWORD_INSTRUCTIONS_MESSAGE = "You'll receive instructions via email."
export const RESET_PASSWORD_SUCCESS_MESSAGE = "Password reset successful."

export const PASSWORD_MIN_LENGTH_MESSAGE = "Password must be at least 8 characters"
export const PASSWORD_MAX_LENGTH_MESSAGE = "Password must be at most 100 characters"
export const PASSWORD_UPPERCASE_LETTER_MESSAGE = "Password must contain at least one uppercase letter"
export const PASSWORD_LOWERCASE_LETTER_MESSAGE = "Password must contain at least one lowercase letter"
export const PASSWORD_NUMBER_MESSAGE = "Password must contain at least one number"
export const PASSWORD_SPECIAL_CHARACTER_MESSAGE = "Password must contain at least one special character"
export const CONFIRM_PASSWORD_MIN_LENGTH_MESSAGE = "Confirm password must be at least 8 characters"
export const PASSWORDS_DO_NOT_MATCH_MESSAGE = "Passwords do not match"
export const CONFIRM_PASSWORD_PATH = "confirmPassword"

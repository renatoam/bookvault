import { Router, type Request, type Response } from "express";
import {
  authenticate,
  forgotBodyValidation,
  resetBodyValidation,
  signInBodyValidation,
  signUpBodyValidation
} from "../../infrastructure/middlewares";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

export const authRouter = Router()

const init = (method: keyof AuthController) => {
  return async (request: Request, response: Response) => {
    const authService = new AuthService()
    const authController = new AuthController(authService)

    return authController[method](request, response)
  }
}

// Public routes
authRouter.post('/signin', signInBodyValidation, init('signIn'))
authRouter.post('/signup', signUpBodyValidation, init('signUp'))
authRouter.post('/refresh', init('refresh'))
authRouter.post('/forgot-password', forgotBodyValidation, init('forgotPassword'))
authRouter.post('/reset-password', resetBodyValidation, init('resetPassword'))

// Protected routes
authRouter.post('/signout', authenticate, init('signOut'))
authRouter.get('/me', authenticate, init('me'))

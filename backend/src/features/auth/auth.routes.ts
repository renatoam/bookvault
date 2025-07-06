import { Router } from "express";
import { AuthController } from "./auth.controller";
import {
  authenticate,
  forgotBodyValidation,
  resetBodyValidation,
  signInBodyValidation,
  signUpBodyValidation
} from "../../middlewares";
import { AuthService } from "./auth.service";

export const authRouter = Router()

const authService = new AuthService()
const authController = new AuthController(authService)

authRouter.post('/signin', signInBodyValidation, authController.signIn)
authRouter.post('/signup', signUpBodyValidation, authController.signUp)
authRouter.post('/signout', authenticate, authController.signOut)
authRouter.post('/refresh', authController.refresh)
authRouter.get('/me', authenticate, authController.me)
authRouter.post('/forgot-password', forgotBodyValidation, authController.forgotPassword)
authRouter.post('/reset-password', resetBodyValidation, authController.resetPassword)

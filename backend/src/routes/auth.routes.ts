import { Router } from "express";
import { AuthController } from "../features/auth/auth.controller";
import {
  authenticate,
  forgotBodyValidation,
  resetBodyValidation,
  signInBodyValidation,
  signUpBodyValidation
} from "../middlewares";

export const authRouter = Router()

authRouter.post('/signin', signInBodyValidation, new AuthController().signIn)
authRouter.post('/signup', signUpBodyValidation, new AuthController().signUp)
authRouter.post('/signout', authenticate, new AuthController().signOut)
authRouter.post('/refresh', new AuthController().refresh)
authRouter.get('/me', authenticate, new AuthController().me)
authRouter.post('/forgot-password', forgotBodyValidation, new AuthController().forgotPassword)
authRouter.post('/reset-password', resetBodyValidation, new AuthController().resetPassword)

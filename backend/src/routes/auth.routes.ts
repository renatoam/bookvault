import { Router, type Request, type Response } from "express";

export const authRouter = Router()

authRouter.get('/health', async (request: Request, response: Response) => {
  console.log(request.headers)
  return response.status(200).json('Check success')
})

authRouter.get('/signin', async (request: Request, response: Response) => {
  console.log(request.headers)
  return response.status(200).json('Auth success')
})

authRouter.post('/signup', async (request: Request, response: Response) => {
  console.log('Body', request.body)
  return response.status(200).json('Registered with success')
})

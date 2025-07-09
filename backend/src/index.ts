import cors from "cors";
import { json, type Request, type Response } from 'express';
import helmet from "helmet";
import pino from "pino-http";
import { limiter } from "./infrastructure/config/rateLimit";
import { app } from "./infrastructure/config/server";
import { router } from "./infrastructure/config/router";
import cookieParser from 'cookie-parser'

app.use(helmet());
app.use(pino());
app.use(cors({
  origin: [process.env.FRONTEND_URL ?? 'http://localhost:5173'],
  credentials: true
}));
app.use(json())
app.use(cookieParser())

app.use('/v1', router)

app.all('/', limiter, (request: Request, response: Response) => {
  if (request.method !== 'GET') {
    return response.status(403).json('Invalid method.')
  }

  return response.status(200).json('Try our v1 endpoints.')
})

app.listen(process.env.PORT ?? 4000, () => {
  console.log("Server is running on port 4000");
});

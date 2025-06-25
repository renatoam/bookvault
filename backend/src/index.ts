import express from "express";
import helmet from "helmet";
import pino from "pino-http";
import cors from "cors";
import { rateLimit } from 'express-rate-limit'

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.get("/", limiter, (req, res) => {
  res.send("Hello World");
});

app.use(helmet());
app.use(pino());
app.use(cors());

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});

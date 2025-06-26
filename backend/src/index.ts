import helmet from "helmet";
import pino from "pino-http";
import cors from "cors";
import { app } from "./config/server";
import { router } from "./routes";
import { prisma } from "./config/prisma";

const allUsers = await prisma.user.findMany()
console.log({ allUsers })

app.use(helmet());
app.use(pino());
app.use(cors());

app.use(router)

app.listen(process.env.PORT ?? 4000, () => {
  console.log("Server is running on port 4000");
});

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { successResponseMiddleware } from "./middleware/successResponseMiddleware";
import routes from "./routes";

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
);
app.use(cookieParser());
// Default JSON body limit (~100kb). Do not raise without a reason.
app.use(express.json());
app.use(successResponseMiddleware);
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;

import express from "express";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import {
  createOpenApiExpressMiddleware,
  generateOpenApiDocument,
} from "trpc-openapi";
import { appRouter } from "./server";
import cors from "cors";

const PORT = 5005;

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: "Article Server API",
  version: "1.0.0",
  baseUrl: `http://localhost:${PORT}/api/v1`,
});

const app = express();
app.use(morgan("dev"));
app.use(cors());

app.use("/api/v1", createOpenApiExpressMiddleware({ router: appRouter }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.get("/", (req, res) => {
  res.json({ message: "Hello!" });
});

app.listen(PORT, () =>
  console.info(
    `----\nServer started.\nEndpoint: http://localhost:${PORT}/api/v1\nAPI Doc: http://localhost:${PORT}/api-docs\n----`
  )
);

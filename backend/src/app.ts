import express from "express";
import morgan from "morgan";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

// Todas as rotas da aplicação (sem prefixo de versão)
app.use("/", routes);

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware global de tratamento de erros
app.use(errorHandler);

export default app;

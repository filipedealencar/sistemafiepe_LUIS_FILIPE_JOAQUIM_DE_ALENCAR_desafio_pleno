import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { swaggerSpec } from './config/swagger';

const app = express();

// -------------------
// Middlewares globais
// -------------------
app.use(express.json());
app.use(helmet()); // Segurança de headers HTTP
app.use(cors()); // Controle de acesso entre domínios
app.use(morgan('combined')); // Logs detalhados
app.set('trust proxy', 1); // Necessário quando está atrás de um proxy (Heroku, Nginx)

// -------------------
// Rate Limiting
// -------------------
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo de 100 requisições por IP por janela
  message: {
    erro: 'too_many_requests',
    mensagem: 'Muitas requisições, tente novamente mais tarde.',
  },
});
app.use(limiter);

// -------------------
// Rotas da aplicação
// -------------------
app.use('/api/v1', routes);

// -------------------
// Documentação Swagger
// -------------------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// -------------------
// Middleware de erros
// -------------------
app.use(errorHandler);

export default app;

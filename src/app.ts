import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './config/swagger';
import { routes } from './routes';
import { errorMiddleware } from './middlewares/error.middleware';

export const app = express();

// Configurações de Middlewares Globais
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota raiz amigável direcionando para a Documentação Swagger
app.get('/', (_req, res) => {
  res.status(200).json({
    projeto: 'MR - Material de Construção • API REST Comercial',
    versao: '1.0.0',
    descricao:
      'API REST para gestão comercial, orçamentos, produtos e clientes adaptada ao design do front-end.',
    documentacaoSwagger: '/api-docs',
    statusEndpoint: '/api/health',
    credenciaisPadrao: {
      email: 'admin@mrconstrucao.com.br',
      senha: 'tecinfo2026',
    },
  });
});

// Documentação Interativa OpenAPI / Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/docs', (_req, res) => {
  res.redirect('/api-docs');
});

// Montagem das Rotas da Aplicação (disponível com ou sem o prefixo /api)
app.use('/api', routes);
app.use('/', routes);

// Middleware Centralizado de Tratamento de Erros (deve ser o último)
app.use(errorMiddleware);

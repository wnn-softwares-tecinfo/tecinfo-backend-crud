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

const swaggerOptions = {
  customSiteTitle: 'MR - Material de Construção • API Docs',
};

// Prefixo de Produção na VPS
const PROD_BASE = '/tecinfo/labs/api-mr-construcao';

// =================================================================
// 📖 DOCUMENTAÇÃO SWAGGER UI
// =================================================================
// Rota de Produção: winnicius.com/tecinfo/labs/api-mr-construcao/docs
app.use(
  `${PROD_BASE}/docs`,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, swaggerOptions)
);

// Rota Local de Desenvolvimento: localhost:3000/api-docs ou /docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));
app.use('/docs', (_req, res) => {
  res.redirect('/api-docs');
});

// Redirecionamento amigável da raiz do subpath para a documentação
app.get(PROD_BASE, (_req, res) => {
  res.redirect(`${PROD_BASE}/docs`);
});

// =================================================================
// 🚀 ENDPOINT INICIAL DA API (SERVER)
// =================================================================
const respostaInicialServidor = {
  projeto: 'MR - Material de Construção • API REST Comercial',
  versao: '1.0.0',
  descricao:
    'API REST para gestão comercial, orçamentos, produtos e clientes adaptada ao design do front-end.',
  documentacaoSwagger: `${PROD_BASE}/docs`,
  statusEndpoint: `${PROD_BASE}/server/api/health`,
  credenciaisPadrao: {
    admin: 'admin@mrconstrucao.com.br / tecinfo2026',
    vendedor: 'vendedor@mrconstrucao.com.br / tecinfo2026',
  },
};

// Endereço inicial da API em Produção: winnicius.com/tecinfo/labs/api-mr-construcao/server
app.get(`${PROD_BASE}/server`, (_req, res) => {
  res.status(200).json(respostaInicialServidor);
});

// Rota raiz local amigável (Desenvolvimento)
app.get('/', (_req, res) => {
  res.status(200).json({
    ...respostaInicialServidor,
    documentacaoSwagger: '/api-docs',
    statusEndpoint: '/api/health',
  });
});

// =================================================================
// 🛣️ MONTAGEM DAS ROTAS DA APLICAÇÃO
// =================================================================
// Rotas sob o prefixo de produção
app.use(`${PROD_BASE}/server/api`, routes);
app.use(`${PROD_BASE}/server`, routes);

// Rotas locais (com ou sem prefixo /api)
app.use('/api', routes);
app.use('/', routes);

// Middleware Centralizado de Tratamento de Erros (deve ser o último)
app.use(errorMiddleware);

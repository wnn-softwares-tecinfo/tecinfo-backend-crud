import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
  console.log('=====================================================');
  console.log('MR - MATERIAL DE CONSTRUÇÃO • BACK-END API REST');
  console.log('   "Um jeito fácil de construir barato"');
  console.log('=====================================================');
  console.log(`Servidor rodando com sucesso em: http://localhost:${PORT}`);
  console.log(`Documentação Swagger UI:         http://localhost:${PORT}/api-docs`);
  console.log(`Healthcheck da aplicação:        http://localhost:${PORT}/api/health`);
  console.log('-----------------------------------------------------');
  console.log('Credenciais de Teste / Seed Inicial:');
  console.log('   Admin:    admin@mrconstrucao.com.br / tecinfo2026');
  console.log('   Vendedor: vendedor@mrconstrucao.com.br / tecinfo2026');
  console.log('=====================================================');
});

# =====================================================================
# STAGE 1: Builder
# =====================================================================
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar manifestos de dependência
COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instalar dependências e gerar o Prisma Client
RUN npm ci
RUN npx prisma generate

# Copiar código-fonte e compilar TypeScript
COPY src ./src
RUN npm run build

# Remover dependências de desenvolvimento para reduzir a imagem final
RUN npm prune --production

# =====================================================================
# STAGE 2: Runner de Produção
# =====================================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Criar usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Copiar artefatos essenciais
COPY --from=builder /app/package*.json ./
COPY --from=builder --chown=appuser:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/prisma ./prisma

USER appuser

EXPOSE 3000

# Sincroniza as tabelas, injeta dados caso necessário e inicia o servidor HTTP
CMD ["sh", "-c", "npx prisma db push && npm run prisma:seed && node dist/server.js"]

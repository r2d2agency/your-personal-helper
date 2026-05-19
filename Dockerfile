# ============================================
# DOCKERFILE PARA TANSTACK START (PRODUÇÃO)
# ============================================
FROM node:20-slim AS builder
WORKDIR /app

# Instalar dependências
COPY package.json bun.lock* package-lock.json* ./
RUN npm install

# Copiar código e gerar build
COPY . .
RUN npm run build

# Estágio final
FROM node:20-slim
WORKDIR /app

# Copiar apenas os artefatos necessários
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
# Opcional: Copiar fontes para depuração se necessário
# COPY --from=builder /app/src ./src

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Servimos os arquivos estáticos do cliente usando o preview do Vite
# O TanStack Start em containers geralmente exige um servidor Node robusto, mas para visualização básica
# do frontend o preview é suficiente.
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]

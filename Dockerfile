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

# Usamos o script start do TanStack Start se disponível, ou o preview do Vite
# Como o erro anterior mencionava a falta de arquivos no roteador, o preview costuma ser a melhor escolha
# para servir o build estático gerado pelo TanStack Start em containers.
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]

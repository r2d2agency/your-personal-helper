# ============================================
# FRONTEND ONLY - Use this with Directory Root: /
# ============================================
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json bun.lock* package-lock.json* ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/vite.config.ts ./vite.config.ts
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["sh", "-c", "npm run preview -- --host 0.0.0.0 --port ${PORT:-3000}"]

FROM node:20-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev

COPY backend ./backend
COPY schema.sql ./schema.sql

ENV NODE_ENV=production
ENV START_HEALTH_SERVER=true
ENV PORT=3001

EXPOSE 3001

CMD ["node", "backend/index.cjs"]
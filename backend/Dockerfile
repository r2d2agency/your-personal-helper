# ============================================
# BACKEND ONLY - Use this with Directory Root: /backend
# ============================================
FROM node:20-slim
WORKDIR /app

# Copy package files and install only backend dependencies
COPY package.json ./
RUN npm install pg dotenv

# Copy backend code and schema
COPY index.cjs ./
COPY schema.sql ./schema.sql

EXPOSE 3001

ENV NODE_ENV=production
ENV BACKEND_PORT=3001

CMD ["node", "index.cjs"]

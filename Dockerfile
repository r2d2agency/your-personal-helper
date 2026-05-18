# Stage 1: Build
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies
COPY package.json bun.lock* package-lock.json* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:20-slim
WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/schema.sql ./schema.sql

# Expose port
EXPOSE 3000

# Set environment variables for Vite preview to work as a production server
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Start server (runs migrations first via npm start)
CMD ["npm", "start", "--", "--port", "3000", "--host", "0.0.0.0"]

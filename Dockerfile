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
# Copy the backend folder too if Easypanel expects it
COPY --from=builder /app/backend ./backend

# Expose port
EXPOSE 3000

# For TanStack Start, we often use vite preview or a custom server
# Since this is a Lovable project, we'll use vite preview as a robust way to serve the build
# in a Node environment if no specific production server is configured.
CMD ["npm", "run", "preview", "--", "--port", "3000", "--host"]

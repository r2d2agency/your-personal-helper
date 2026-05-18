FROM node:20-slim

WORKDIR /app

# The build context is assumed to be the 'backend' directory
COPY package.json ./
RUN npm install --omit=dev

COPY index.cjs ./
COPY schema.sql ./

ENV NODE_ENV=production
ENV START_HEALTH_SERVER=true
ENV PORT=3001

EXPOSE 3001

CMD ["node", "index.cjs"]

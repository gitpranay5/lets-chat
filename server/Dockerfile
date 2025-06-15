# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install firebase
COPY . .
RUN npm prune --production

# Copy environment file from server directory  
COPY server/.env /app/.env

# Stage 2: Runtime Stage
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

# Ensure Node.js loads environment variables  
RUN npm install dotenv && echo "import dotenv from 'dotenv'; dotenv.config({ path: '/app/.env' });" >> index.js


EXPOSE 8080
CMD ["node", "index.js"]

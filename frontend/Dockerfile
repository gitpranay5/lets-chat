# Stage 1: Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Accept the API URL from build args
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Copy environment file
COPY .env /app/.env

# Copy package.json first for caching
COPY package*.json ./
RUN npm install  # Install dependencies
RUN npm install firebase

# Copy the rest of the app AFTER npm install to avoid invalidating cache
COPY . .
COPY default.conf /etc/nginx/conf.d/default.conf

# Print the API URL for debug (optional)
RUN echo "Using API URL: $REACT_APP_API_URL"

# Ensure React build picks up environment variables
RUN export $(cat /app/.env | xargs) && npm run build

# Stage 2: Runtime Stage
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Copy only the built frontend files
COPY --from=builder /app/build /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

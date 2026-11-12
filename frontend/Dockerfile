# ==============================================================================
# Multi-stage Dockerfile for React + Vite Frontend on Google Cloud Run
# ==============================================================================

# Stage 1: Build the Vite production bundle
FROM node:20-alpine AS builder
WORKDIR /app

# Accept Backend API URL at container build time
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: High-performance Nginx Alpine runtime
FROM nginx:alpine

# Copy custom Nginx configuration template for Cloud Run & SPA routing
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Copy compiled static assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Google Cloud Run injects $PORT environment variable (default 8080)
ENV PORT=8080
EXPOSE 8080

# Substitute $PORT into Nginx configuration at startup and launch Nginx
CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

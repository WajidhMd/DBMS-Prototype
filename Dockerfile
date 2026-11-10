# Multi-stage Dockerfile for PACIFIC Full-Stack E-Commerce Deployment
# Stage 1: Build React Vite Frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Production Node.js Server
FROM node:20-alpine
WORKDIR /app

# Install backend production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy backend application source
COPY backend/ ./backend/

# Copy database seeds & snapshots
COPY database/ ./database/

# Copy compiled frontend distribution from Stage 1
COPY --from=build-frontend /app/frontend/dist ./frontend/dist

# Default Cloud Run PORT is 8080
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

WORKDIR /app/backend
CMD ["node", "server.js"]


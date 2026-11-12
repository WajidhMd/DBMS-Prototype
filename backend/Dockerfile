# ==============================================================================
# Production Dockerfile for Node.js Express Backend on Google Cloud Run
# ==============================================================================
FROM node:20-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source code, seed snapshots, and database scripts
COPY . .

# Cloud Run defaults: binds to 0.0.0.0 and PORT (defaults to 8080)
ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start Express server
CMD ["node", "server.js"]

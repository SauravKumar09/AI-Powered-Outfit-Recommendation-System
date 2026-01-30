# ============================================
# Frontend Dockerfile - React App (Vite)
# ============================================

FROM node:18-alpine

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install --silent

# Copy source
COPY . .

# Build with API base override support
ARG VITE_API_BASE_URL=http://localhost:8000/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# Expose Vite preview port
EXPOSE 4173

# Health check via preview server
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget -qO- http://localhost:4173/ || exit 1

# Serve built assets with Vite preview
CMD ["npm", "run", "preview", "--", "--host", "--port", "4173"]
# ===============================================================
# Stage 1: Build Frontend (React + Vite + Tailwind CSS)
# ===============================================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/Frontend

# Install dependencies first for optimal Docker layer caching
COPY Frontend/package*.json ./
RUN npm install

# Copy frontend source code and build production bundle
COPY Frontend/ ./
ARG VITE_API_BASE=/api
ENV VITE_API_BASE=${VITE_API_BASE}
RUN npm run build

# ===============================================================
# Stage 2: Standalone Backend Stage (Target: backend)
# ===============================================================
FROM python:3.11-slim AS backend
WORKDIR /app/Backend

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY Backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY Backend/ ./

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# ===============================================================
# Stage 3: Standalone Frontend Stage (Target: frontend)
# ===============================================================
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/Frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ===============================================================
# Stage 4: Production Full-Stack Container (Default Target)
# ===============================================================
FROM python:3.11-slim AS production
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Install Nginx, Supervisor, and curl for process management and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    nginx \
    supervisor \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python backend dependencies
COPY Backend/requirements.txt /app/Backend/
RUN pip install --no-cache-dir -r /app/Backend/requirements.txt

# Copy Backend application
COPY Backend/ /app/Backend/

# Copy built frontend assets to Nginx html directory
COPY --from=frontend-builder /app/Frontend/dist /usr/share/nginx/html

# Copy Nginx and Supervisor configurations
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose port 80 (HTTP) and port 8000 (Direct FastAPI)
EXPOSE 80 8000

# Health check against the health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Start supervisor managing both Uvicorn and Nginx
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

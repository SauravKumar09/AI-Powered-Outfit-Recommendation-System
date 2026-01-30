# ============================================
# Backend Dockerfile - Django API
# ============================================

FROM python:3.12-slim

# Core environment settings
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    DJANGO_SETTINGS_MODULE=backend.settings

WORKDIR /app

# Install system dependencies required for psycopg2 and tooling
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    curl \
    netcat-traditional \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy project source
COPY . .

# Expose Django dev server port
EXPOSE 8000

# Default command (overridden in docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# # Use Python 3.11 slim image
# FROM python:3.12-slim

# # Set environment variables
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# # Set work directory
# WORKDIR /app

# # Install system dependencies
# RUN apt-get update && apt-get install -y \
#     gcc \
#     libpq-dev \
#     curl \
#     && rm -rf /var/lib/apt/lists/*

# # Install Python dependencies
# COPY requirements.txt .
# RUN pip install --upgrade pip && \
#     pip install --no-cache-dir -r requirements.txt

# # Copy project
# COPY . .

# # Create staticfiles directory
# RUN mkdir -p /app/staticfiles

# # Expose port
# EXPOSE 8000

# # Default command
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
# # # Use Python 3.12 slim image (3.13 breaks psycopg2-binary build)
# # FROM python:3.12-slim

# # # Set environment variables
# # ENV PYTHONDONTWRITEBYTECODE=1
# # ENV PYTHONUNBUFFERED=1

# # # Set work directory
# # WORKDIR /app

# # # Install system dependencies
# # RUN apt-get update && apt-get install -y \
# #     gcc \
# #     libpq-dev \
# #     curl \
# #     && rm -rf /var/lib/apt/lists/*

# # # Install Python dependencies
# # COPY requirements.txt .
# # RUN pip install --upgrade pip && \
# #     pip install --no-cache-dir -r requirements.txt

# # # Copy project
# # COPY . .

# # # Create non-root user for security
# # RUN adduser --disabled-password --gecos '' appuser && \
# #     chown -R appuser:appuser /app
# # USER appuser

# # # Expose port
# # EXPOSE 8000

# # # Health check
# # HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
# #     CMD curl -f http://localhost:8000/api/health/ || exit 1

# # # Default command
# # CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
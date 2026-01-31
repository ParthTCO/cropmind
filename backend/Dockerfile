FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Add PyYAML for crop config loading
RUN pip install --no-cache-dir PyYAML

# Copy application code
COPY . .

# Runtime configuration via ARGs (can be overridden in docker-compose)
ARG APP_HOST=0.0.0.0
ARG APP_PORT=8000
ARG APP_MODULE=app.main:app

# Set as environment variables
ENV APP_HOST=${APP_HOST}
ENV APP_PORT=${APP_PORT}
ENV APP_MODULE=${APP_MODULE}

# Run the application with configurable parameters
CMD uvicorn ${APP_MODULE} --host ${APP_HOST} --port ${APP_PORT}

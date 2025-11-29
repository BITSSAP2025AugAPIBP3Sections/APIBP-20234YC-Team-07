FROM python:3.12-slim

# Small, production-ready Dockerfile for FastAPI on Cloud Run
WORKDIR /app

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Cloud Run provides the PORT environment variable; default to 8080 for local runs
ENV PORT=8080
EXPOSE 8080

# Start the app with the PORT from environment
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT}"]


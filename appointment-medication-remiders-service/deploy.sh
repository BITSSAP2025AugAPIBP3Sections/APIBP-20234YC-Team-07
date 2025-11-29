#!/usr/bin/env bash
set -euo pipefail

# deploy.sh - build image with Cloud Build and deploy to Cloud Run
# Usage:
#   PROJECT_ID=your-project REGION=us-central1 ./deploy.sh

PROJECT_ID=${PROJECT_ID:-$(gcloud config get-value project 2>/dev/null)}
REGION=${REGION:-us-central1}
SERVICE_NAME=${SERVICE_NAME:-appointment-medication-reminders}
IMAGE_TAG=${IMAGE_TAG:-v1}
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:${IMAGE_TAG}"

if [ -z "$PROJECT_ID" ]; then
  echo "ERROR: PROJECT_ID is not set and gcloud config has no project. Run 'gcloud config set project <PROJECT_ID>' or export PROJECT_ID." >&2
  exit 2
fi

echo "Building and pushing image: $IMAGE"
gcloud builds submit --tag "$IMAGE" ./

echo "Deploying $SERVICE_NAME to Cloud Run in region $REGION"
# Example set-env-vars: AUTH_SERVICE_URL, DATABASE_URL - set these in your environment before running or pass them here
# Build comma-separated env var list (more portable than bash arrays)
ENV_KV=""
if [ -n "${AUTH_SERVICE_URL:-}" ]; then
  ENV_KV="AUTH_SERVICE_URL=${AUTH_SERVICE_URL}"
fi
if [ -n "${DATABASE_URL:-}" ]; then
  if [ -n "$ENV_KV" ]; then ENV_KV=","$ENV_KV","; fi
  # ensure proper comma separation
  if [ -z "$ENV_KV" ]; then
    ENV_KV="DATABASE_URL=${DATABASE_URL}"
  else
    ENV_KV="$ENV_KV,DATABASE_URL=${DATABASE_URL}"
  fi
fi
# NOTE: Cloud Run sets PORT automatically at runtime; do NOT set PORT via --set-env-vars (it's reserved)

# Deploy (allow unauthenticated by default; remove --allow-unauthenticated if you want to restrict access)
CMD=(gcloud run deploy "$SERVICE_NAME" \
  --image "$IMAGE" \
  --platform managed \
  --region "$REGION" \
  --memory 512Mi \
  --timeout 300s \
  --concurrency 80 \
  --allow-unauthenticated)

if [ -n "${ENV_KV}" ]; then
  CMD+=(--set-env-vars "$ENV_KV")
fi

# Execute the deploy command
"${CMD[@]}"

# Print URL
echo "Deployment complete. Service URL:"
gcloud run services describe "$SERVICE_NAME" --region "$REGION" --format 'value(status.url)'

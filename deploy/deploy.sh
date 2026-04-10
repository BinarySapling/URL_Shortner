#!/bin/bash
# =============================================================
# deploy.sh — Deploy/redeploy the URL Shortener on EC2
# =============================================================
# Usage (from project root):
#   chmod +x deploy/deploy.sh && ./deploy/deploy.sh
# =============================================================

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

echo "================================================="
echo " URL Shortener — Deploy Script"
echo " Directory: $PROJECT_DIR"
echo "================================================="

# 1. Validate .env exists
if [ ! -f ".env" ]; then
  echo ""
  echo "ERROR: .env file not found in project root."
  echo "Create it first — see deploy/README.md for the template."
  exit 1
fi

# 2. Validate required env vars
source .env
MISSING=0
for VAR in MONGO_URI REDIS_URL BASE_URL; do
  if [ -z "${!VAR:-}" ]; then
    echo "ERROR: Missing required env var: $VAR"
    MISSING=1
  fi
done
if [ $MISSING -eq 1 ]; then
  echo "Fix your .env file and re-run this script."
  exit 1
fi

echo "[✓] .env validated — BASE_URL=$BASE_URL"

# 3. Pull latest code (if running from a git repo)
if [ -d ".git" ]; then
  echo ""
  echo "[1/3] Pulling latest code from git..."
  git pull origin main --ff-only || {
    echo "WARNING: git pull failed (maybe detached HEAD or local changes). Proceeding anyway."
  }
fi

# 4. Build and start containers
echo ""
echo "[2/3] Building and starting containers..."
docker compose pull --quiet 2>/dev/null || true     # pull any upstream image updates
docker compose up -d --build --remove-orphans

# 5. Health check
echo ""
echo "[3/3] Waiting for services to start (15s)..."
sleep 15

echo ""
echo "--- Container status ---"
docker compose ps

echo ""
echo "--- Recent logs ---"
docker compose logs --tail=20

echo ""
echo "================================================="
echo " Deploy complete!"
echo " App is running at: $BASE_URL"
echo "================================================="
echo ""
echo " Useful commands:"
echo "   docker compose logs -f              # Follow all logs"
echo "   docker compose logs -f shortener-service"
echo "   docker compose logs -f redirector-service"
echo "   docker compose ps                   # Container status"
echo "   docker compose down                 # Stop all containers"
echo "================================================="

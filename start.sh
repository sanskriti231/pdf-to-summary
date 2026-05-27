#!/usr/bin/env bash
# shellcheck disable=SC2059,SC2046
set -uo pipefail

echo "🚀 Starting PDF-to-Summary..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ─── Kill stale processes ─────────────────────────────────────────────

for port in 8000 3000; do
  pid=$(lsof -ti :"$port" 2>/dev/null || true)
  if [ -n "$pid" ]; then
    echo -e "${YELLOW}  → Killing stale process on port $port (PID $pid)${NC}"
    kill -9 "$pid" 2>/dev/null || true
    sleep 1
  fi
done

# ─── Backend ───────────────────────────────────────────────────────────

echo -e "${BLUE}[1/2]${NC} Starting FastAPI backend..."

cd "$PROJECT_DIR/backend"

# Activate or create venv
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}  → Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

source venv/bin/activate

if [ ! -f "venv/.installed" ]; then
    echo -e "${YELLOW}  → Installing Python dependencies...${NC}"
    pip install -r requirements.txt -q
    touch venv/.installed
fi

# Export env vars from .env so the backend picks them up
if [ -f ".env" ]; then
    set -o allexport
    source .env
    set +o allexport
fi

# Start backend in background
nohup uvicorn app:app --host 0.0.0.0 --port 8000 --reload --timeout-keep-alive 300 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 2
echo -e "${GREEN}  ✓ Backend running on http://localhost:8000${NC}"

cd "$PROJECT_DIR"

# ─── Frontend ──────────────────────────────────────────────────────────

echo -e "${BLUE}[2/2]${NC} Starting Next.js frontend..."

cd "$PROJECT_DIR/frontend"

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  → Installing Node.js dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}  ✓ Frontend starting on http://localhost:3000${NC}"
echo ""

# Start frontend in background
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# Trap to kill both processes
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; wait $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

sleep 3

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Frontend:  http://localhost:3000${NC}"
echo -e "${GREEN}  Backend:   http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs:  http://localhost:8000/docs${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Press Ctrl+C to stop both servers."

wait

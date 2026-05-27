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
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}" )" && pwd)"

# ─── Kill stale processes ─────────────────────────────────────────────

for port in 8000 3000; do
  pids=$(lsof -ti :"$port" 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo -e "${YELLOW}  → Killing stale process on port $port${NC}"
    # Unquoted so newline-separated PIDs from lsof become separate args
    kill -9 $pids 2>/dev/null || true
    sleep 2
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

# Start backend in background, log to file
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

# Start frontend in background, log to file
npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

sleep 4

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Frontend:  http://localhost:3000${NC}"
echo -e "${GREEN}  Backend:   http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs:  http://localhost:8000/docs${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Logs streaming below (Ctrl+C to stop):${NC}"
echo ""

# Log streaming — line-buffered, macOS-compatible (unlike sed -u)
# Run separate tail for each log with a label prefix
tail -f /tmp/backend.log 2>/dev/null | while IFS= read -r line; do
  printf "${BLUE}─── BACKEND ──${NC} %s\n" "$line"
done &
TAIL_BACKEND_PID=$!

tail -f /tmp/frontend.log 2>/dev/null | while IFS= read -r line; do
  printf "${GREEN}─── FRONTEND ──${NC} %s\n" "$line"
done &
TAIL_FRONTEND_PID=$!

# Trap to kill all child processes on Ctrl+C
trap "echo ''; echo -e '${YELLOW}Shutting down...${NC}'; kill $BACKEND_PID $FRONTEND_PID $TAIL_BACKEND_PID $TAIL_FRONTEND_PID 2>/dev/null; wait $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

# Wait for both servers (tail processes are background children)
wait $BACKEND_PID $FRONTEND_PID 2>/dev/null

#!/usr/bin/env bash
set -e

echo "🚀 Starting PDF-to-Summary..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ─── Backend ───────────────────────────────────────────────────────────

echo -e "${BLUE}[1/2]${NC} Starting FastAPI backend..."

cd backend

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

# Start backend in background
uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo -e "${GREEN}  ✓ Backend running on http://localhost:8000${NC}"

cd ..

# ─── Frontend ──────────────────────────────────────────────────────────

echo -e "${BLUE}[2/2]${NC} Starting Next.js frontend..."

cd frontend

if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}  → Installing Node.js dependencies...${NC}"
    npm install
fi

echo -e "${GREEN}  ✓ Frontend starting on http://localhost:3000${NC}"
echo ""

# Start frontend in foreground
npm run dev &
FRONTEND_PID=$!

# Trap to kill both processes
trap "echo ''; echo 'Shutting down...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Frontend:  http://localhost:3000${NC}"
echo -e "${GREEN}  Backend:   http://localhost:8000${NC}"
echo -e "${GREEN}  API Docs:  http://localhost:8000/docs${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Press Ctrl+C to stop both servers."

wait

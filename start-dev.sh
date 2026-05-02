#!/bin/bash
echo "Starting ChinaUni development servers..."

# Start backend
cd backend
python -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt -q
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo "Backend started at http://localhost:8000 (PID: $BACKEND_PID)"

# Start frontend
cd ../frontend
npm install -q
npm run dev &
FRONTEND_PID=$!
echo "Frontend started at http://localhost:5173 (PID: $FRONTEND_PID)"

echo ""
echo "Press Ctrl+C to stop both servers"
wait

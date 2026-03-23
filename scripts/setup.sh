#!/bin/bash
set -euo pipefail

echo "🔧 Setting up Full-Stack App Template..."

# Check prerequisites
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 required"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js required"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker required"; exit 1; }
command -v poetry >/dev/null 2>&1 || { echo "❌ Poetry required. Install: pip install poetry"; exit 1; }

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend && poetry install
cd ..

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

# Infrastructure
echo "🐳 Starting Redis..."
docker compose up -d redis

# Environment
if [ ! -f .env ]; then
    cp .env.example .env
    echo "📝 Created .env from .env.example — please configure it."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Configure .env with your Supabase credentials"
echo "  2. Run 'make dev-backend' to start the backend"
echo "  3. Run 'make dev-frontend' to start the Expo dev server"

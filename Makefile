.PHONY: setup dev-backend dev-frontend test lint help

# === Setup ===
setup:                          ## Erstmaliges Setup
	cd backend && poetry install
	cd frontend && npm install
	docker compose up -d redis
	cp -n .env.example .env || true
	cd backend && poetry run alembic upgrade head
	@echo "✅ Setup fertig."

# === Backend ===
dev-backend:                    ## Backend starten (Hot-Reload)
	cd backend && poetry run uvicorn src.main:app --reload --port 3000

celery:                         ## Celery Worker starten
	cd backend && poetry run celery -A src.infrastructure.tasks.celery_app worker -l info

# === Frontend ===
dev-frontend:                   ## Expo Dev-Server starten
	cd frontend && npx expo start

# === Qualität ===
test:                           ## Alle Tests
	cd backend && poetry run pytest --cov=src --cov-report=term-missing --cov-fail-under=80
	cd frontend && npm test

test-backend:                   ## Backend Tests
	cd backend && poetry run pytest --cov=src --cov-report=term-missing --cov-fail-under=80

test-frontend:                  ## Frontend Tests
	cd frontend && npm test

lint:                           ## Linting
	cd backend && poetry run ruff check . && poetry run mypy .
	cd frontend && npx eslint .

format:                         ## Formatierung
	cd backend && poetry run ruff format .
	cd frontend && npx prettier --write .

# === Datenbank ===
migrate:                        ## Alembic Migrationen
	cd backend && poetry run alembic upgrade head

migrate-create:                 ## Neue Migration (msg="beschreibung")
	cd backend && poetry run alembic revision --autogenerate -m "$(msg)"

# === Docker ===
up:                             ## Infra starten
	docker compose up -d

down:                           ## Alles stoppen
	docker compose down

help:                           ## Hilfe
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help

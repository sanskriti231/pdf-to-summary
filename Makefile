.PHONY: dev install clean install-backend install-frontend db-push

# ─── Development ───────────────────────────────────────────────────────

dev:
	./start.sh

install: install-backend install-frontend

clean:
	rm -rf backend/venv frontend/node_modules frontend/.next
	rm -f backend/venv/.installed

# ─── Backend ───────────────────────────────────────────────────────────

install-backend:
	cd backend && python3 -m venv venv && \
	. venv/bin/activate && \
	pip install -r requirements.txt -q && \
	touch venv/.installed

# ─── Frontend ──────────────────────────────────────────────────────────

install-frontend:
	cd frontend && npm install

# ─── Database ──────────────────────────────────────────────────────────

db-push:
	cd frontend && npx drizzle-kit push

db-studio:
	cd frontend && npx drizzle-kit studio

db-migrate:
	cd frontend && npx drizzle-kit migrate

db-generate:
	cd frontend && npx drizzle-kit generate

.PHONY: up down restart logs psql check-docker start-docker

OS := $(shell uname)

# Configuración
POSTGRES_CONTAINER=jobs_postgres
POSTGRES_USER=savadb
POSTGRES_DB=insight_job_db

# --------- Targets públicos ---------

up: start-docker
	@echo "-- Levantando contenedores --"
	docker compose up -d
	@echo

down:
	@echo "-- Apagando contenedores --"
	docker compose down
	@echo

restart: down up

logs:
	docker compose logs -f

psql:
	docker exec -it $(POSTGRES_CONTAINER) psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

# --------- Targets internos ---------

start-docker:
	@$(MAKE) check-docker

check-docker:
	@docker info >/dev/null 2>&1 || (echo "❌ Docker no está corriendo" && exit 1)
	@echo "✅ Docker listo"
	@echo

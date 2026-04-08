.PHONY: up down restart logs psql check-docker start-docker minikube-start minikube-stop minikube-build helm-install helm-upgrade helm-uninstall minikube-url geonames-seeder k8s-wait-postgres k8s-wait-app k8s-restart-app k8s-apply-notifications-schema k8s-load-locations k8s-rebuild

OS := $(shell uname)

# Configuración
POSTGRES_CONTAINER=jobs_postgres
POSTGRES_USER=savadb
POSTGRES_DB=insight_job_db
POSTGRES_PASSWORD=savadb
MINIKUBE_PROFILE=insight-job
KUBE_NAMESPACE=insight-job
HELM_RELEASE=insight-job
CHART_DIR=deploy/helm/insight-job
BACKEND_IMAGE=insight-job/backend:local
FRONTEND_IMAGE=insight-job/frontend:local
POSTGRES_SELECTOR=app.kubernetes.io/component=postgres
POSTGRES_DEPLOYMENT=deployment/insight-job-postgres
API_DEPLOYMENT=deployment/insight-job-api
FRONTEND_DEPLOYMENT=deployment/insight-job-frontend
KUBECTL=minikube kubectl --profile $(MINIKUBE_PROFILE) --

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

minikube-start: start-docker
	minikube start --driver=docker --profile $(MINIKUBE_PROFILE)

minikube-stop:
	minikube stop --profile $(MINIKUBE_PROFILE)

minikube-build:
	minikube image build --profile $(MINIKUBE_PROFILE) -t $(BACKEND_IMAGE) -f Dockerfile ./backend
	minikube image build --profile $(MINIKUBE_PROFILE) -t $(FRONTEND_IMAGE) -f Dockerfile ./frontend

helm-install:
	helm upgrade --install $(HELM_RELEASE) $(CHART_DIR) --namespace $(KUBE_NAMESPACE) --create-namespace -f $(CHART_DIR)/values-minikube.yaml

helm-upgrade:
	helm upgrade --install $(HELM_RELEASE) $(CHART_DIR) --namespace $(KUBE_NAMESPACE) --create-namespace -f $(CHART_DIR)/values-minikube.yaml

helm-uninstall:
	helm uninstall $(HELM_RELEASE) --namespace $(KUBE_NAMESPACE)

minikube-url:
	minikube service insight-job-frontend --namespace $(KUBE_NAMESPACE) --profile $(MINIKUBE_PROFILE) --url

geonames-seeder:
	python3 scrapper/geonames_seeder.py

k8s-wait-postgres:
	$(KUBECTL) wait -n $(KUBE_NAMESPACE) --for=condition=Available $(POSTGRES_DEPLOYMENT) --timeout=180s

k8s-restart-app:
	$(KUBECTL) rollout restart -n $(KUBE_NAMESPACE) $(API_DEPLOYMENT)
	$(KUBECTL) rollout restart -n $(KUBE_NAMESPACE) $(FRONTEND_DEPLOYMENT)

k8s-wait-app:
	$(KUBECTL) wait -n $(KUBE_NAMESPACE) --for=condition=Available $(API_DEPLOYMENT) --timeout=180s
	$(KUBECTL) wait -n $(KUBE_NAMESPACE) --for=condition=Available $(FRONTEND_DEPLOYMENT) --timeout=180s

k8s-apply-notifications-schema: k8s-wait-postgres
	$(KUBECTL) cp database/notifications.sql $(KUBE_NAMESPACE)/$$($(KUBECTL) get pods -n $(KUBE_NAMESPACE) -l $(POSTGRES_SELECTOR) -o jsonpath='{.items[0].metadata.name}'):/tmp/notifications.sql
	$(KUBECTL) exec -n $(KUBE_NAMESPACE) $$($(KUBECTL) get pods -n $(KUBE_NAMESPACE) -l $(POSTGRES_SELECTOR) -o jsonpath='{.items[0].metadata.name}') -- env PGPASSWORD=$(POSTGRES_PASSWORD) psql -v ON_ERROR_STOP=1 -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /tmp/notifications.sql

k8s-load-locations: geonames-seeder k8s-wait-postgres
	$(KUBECTL) cp database/locations_seeder.sql $(KUBE_NAMESPACE)/$$($(KUBECTL) get pods -n $(KUBE_NAMESPACE) -l $(POSTGRES_SELECTOR) -o jsonpath='{.items[0].metadata.name}'):/tmp/locations_seeder.sql
	$(KUBECTL) exec -n $(KUBE_NAMESPACE) $$($(KUBECTL) get pods -n $(KUBE_NAMESPACE) -l $(POSTGRES_SELECTOR) -o jsonpath='{.items[0].metadata.name}') -- env PGPASSWORD=$(POSTGRES_PASSWORD) psql -v ON_ERROR_STOP=1 -U $(POSTGRES_USER) -d $(POSTGRES_DB) -f /tmp/locations_seeder.sql

k8s-rebuild: minikube-start minikube-build helm-upgrade k8s-apply-notifications-schema k8s-load-locations k8s-restart-app k8s-wait-app

# --------- Targets internos ---------

start-docker:
	@$(MAKE) check-docker

check-docker:
	@docker info >/dev/null 2>&1 || (echo "❌ Docker no está corriendo" && exit 1)
	@echo "✅ Docker listo"
	@echo

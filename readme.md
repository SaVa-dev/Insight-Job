# Insight Job
Job scrapper for searching the best job options depending on the jobs you're searching for.

## Programs required for running project
- Docker
- Docker Compose
- Start docker daemon or run Docker desktop
- Make
- Minikube
- Helm

## Configurations needed for running project
You have to define the .env files in the backend and database folders. there's a .env.example file to view what you need to declare in those files. Also be sure to match the docker-compose ports and the .env ports.

## Project commands:
- Start the containers: `make up`
- Stop the containers: `make down`
- Restart the containers: `make restart`
- View containers logs: `make logs`
- Access psql shell: `make psql`
- Generate the GeoNames locations seeder: `make geonames-seeder`
- Wait until the Kubernetes Postgres deployment is available: `make k8s-wait-postgres`
- Load the generated locations seeder into the Kubernetes Postgres already running: `make k8s-load-locations`
- Restart the API and frontend deployments in Kubernetes: `make k8s-restart-app`
- Wait until the API and frontend deployments are available: `make k8s-wait-app`
- Rebuild the whole Kubernetes project in Minikube: `make k8s-rebuild`

## Kubernetes with Minikube and Helm
- Start Minikube: `make minikube-start`
- Build local images into Minikube: `make minikube-build`
- Install the chart: `make helm-install`
- Upgrade the release: `make helm-upgrade`
- Uninstall the release: `make helm-uninstall`
- Get the frontend URL from Minikube: `make minikube-url`

The Helm chart lives in `deploy/helm/insight-job` and the Minikube overrides live in `deploy/helm/insight-job/values-minikube.yaml`.
The large GeoNames locations dataset is not bundled into the Helm chart because it exceeds Helm's file size limit. If you update `cities5000.txt`, run `make geonames-seeder` and then `make k8s-load-locations` to apply the new locations into the existing Kubernetes database.
For a full rebuild of the running Minikube project, use `make k8s-rebuild` and then `make minikube-url`.

## CI
GitHub Actions CI was added in `.github/workflows/ci.yml`.
It validates only that the frontend builds correctly.

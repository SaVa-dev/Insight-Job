# Plan: InsightJob - Completar Proyecto

## Contexto

InsightJob es un proyecto escolar de web scraping de trabajos con recomendaciones. Actualmente tiene:
- **Backend**: Express 5 + PostgreSQL 16 (auth + profiles CRUD)
- **Frontend**: React 19 + Vite + TailwindCSS (login, register, dashboard vacio, profiles, account) -- en `main`, el usuario lo mantiene el mismo
- **Scrapper**: Scripts Python para procesar datos de ESCO/GeoNames (no scraping real aun)
- **Docker**: Compose con 2 servicios (api + postgres), frontend NO incluido
- **DB**: Schema bien disenada con 13 tablas, 138 skills y 67K+ locations seedeados

**Objetivo**: Agregar paginas/vistas extras al frontend, integrar DevOps (K8s, GitHub Actions, Nginx), y generar CSV de tareas para Jira.

**Restriccion**: No modificar mucho el backend (nada de notificaciones).

**Prioridad del usuario**: DevOps y Frontend primero, en paralelo.

---

## Fase 1: DevOps + Frontend (en paralelo)

### A) DevOps - Docker y Nginx (DOCK)

#### DOCK-1: Completar Docker Compose
- Agregar servicio `frontend` al `docker-compose.yml`
- Agregar servicio `nginx` como reverse proxy
- **Archivos nuevos**: `nginx/nginx.conf`, `nginx/Dockerfile`
- Nginx: `/` -> frontend, `/api/*` -> backend
- Crear `docker-compose.prod.yml` (imagenes built, sin volumes)

#### DOCK-2: Gestion de Environment
- Crear `.env.example` en backend/, database/, frontend/
- Actualizar `.gitignore` para excluir `.env` reales

### B) DevOps - CI/CD con GitHub Actions (CICD)

#### CICD-1: Pipeline CI
- **Archivo**: `.github/workflows/ci.yml`
- Trigger: push/PR a `main`
- Job 1: Lint + Build frontend (`npm ci && npm run build`)
- Job 2: Test backend (con servicio postgres)
- Job 3: Build imagenes Docker + push a ghcr.io
- Job 4: Security scan (`npm audit`)

#### CICD-2: Pipeline CD (placeholder)
- **Archivo**: `.github/workflows/cd.yml`
- Trigger: push a `main` despues de CI
- Placeholder deploy a K8s cluster

### C) DevOps - Kubernetes (K8S)

#### K8S-1: Manifests Core
Directorio `k8s/` con:
- `namespace.yml` - Namespace `insightjob`
- `configmap.yml` - Config no-sensible (ports, hosts)
- `secrets.yml` - Template para passwords y JWT secret
- `postgres/deployment.yml` + `service.yml` + `pvc.yml`
- `backend/deployment.yml` (2 replicas, liveness/readiness probes en `/health`) + `service.yml`
- `frontend/deployment.yml` + `service.yml`
- `ingress.yml` - Nginx Ingress: `/` -> frontend, `/api` -> backend

#### K8S-2: Features Avanzados
- `backend/hpa.yml` - HorizontalPodAutoscaler (2-5 replicas)
- `kustomization.yml` - Orquestacion de todos los manifests
- `networkpolicy.yml` - Reglas de comunicacion entre pods

### D) Frontend - Nuevas Paginas (FE)

> Nota: El frontend en `main` es del usuario. Las nuevas paginas se crean en el directorio `frontend/src/pages/` existente.

#### FE-1: Landing Page (`/`)
- **Archivo**: `frontend/src/pages/Landing.jsx`
- Hero section con titulo, descripcion, CTA a `/register` y `/login`
- Feature cards: "Smart Matching", "Real-Time Scraping", "Perfiles Personalizados"
- Stats bar: "67K+ Ubicaciones", "138 Skills", etc.
- Footer con creditos
- Cambiar ruta `/` de redirect a Login -> Landing (PublicRoute)

#### FE-2: Dashboard con Listado de Trabajos (`/dashboard`)
- **Archivos**: Reescribir `Dashboard.jsx`, crear `JobCard.jsx`, `SearchBar.jsx`
- Barra de busqueda (texto + filtro skills + filtro ubicacion)
- Fila de stats: total trabajos, nuevos hoy, perfiles activos
- Grid de JobCards: titulo, empresa, ubicacion, skills badges, experiencia
- Cada card linkea a `/jobs/:id`
- Agregar a `api.js`: `getJobs(params)`, `getJobById(id)`

#### FE-3: Detalle de Trabajo (`/jobs/:id`)
- **Archivo**: `frontend/src/pages/JobDetail.jsx`
- Header: titulo, empresa, fecha, badge activo/inactivo
- Descripcion completa, skills requeridos, ubicaciones
- Rango de experiencia, URL fuente
- Botones: "Marcar Aplicado", "Favorito" (tabla `user_job`)
- Agregar a `api.js`: `applyToJob(id)`, `favoriteJob(id)`

#### FE-4: Pagina de Analiticas (`/analytics`)
- **Archivo**: `frontend/src/pages/Analytics.jsx`
- Instalar `recharts`
- Cards resumen: Total Jobs, Companies, Skills, Locations
- Grafica: Jobs por empresa (barras)
- Grafica: Top 10 skills mas solicitados (barras horizontales)
- Grafica: Jobs por ubicacion (pie chart)
- Reemplazar "Notificaciones" en Navbar por "Analiticas"
- Agregar a `api.js`: `getStats()`

#### FE-5: Pagina About (`/about`)
- **Archivo**: `frontend/src/pages/About.jsx`
- Descripcion del proyecto y objetivos
- Grid de tech stack con iconos
- Cards del equipo
- Ruta publica

#### FE-6: UI Polish
- Fix titulo `index.html`: "frontend" -> "Insight Job"
- Agregar loading states/skeletons
- Verificar responsive en mobile

---

## Fase 2: Backend Minimo (para soportar las vistas)

#### BE-1: Fix Auth (cookie-parser + cors)
- **Archivo**: `backend/app.js`
- Montar `cookie-parser` y `cors` (ya instalados, faltan 2 lineas)
- Sin esto, la auth con cookies no funciona

#### BE-2: API de Jobs (read-only)
- **Archivos**: `backend/db/jobs.js`, `backend/router/jobs.route.js`
- `GET /jobs` - Listar jobs con paginacion y filtros
- `GET /jobs/:id` - Detalle de un job con skills, locations, company
- `POST /jobs/:id/apply` - Marcar como aplicado (user_job)
- `POST /jobs/:id/favorite` - Marcar como favorito (user_job)

#### BE-3: API de Stats
- **Archivos**: `backend/db/stats.js`, `backend/router/stats.route.js`
- `GET /stats` - Queries agregados

#### BE-4: Health Check
- `GET /health` en `app.js` - Necesario para probes de Kubernetes

---

## Fase 3: Datos y Testing

#### DATA-1: Seeder de Jobs
- **Archivo**: `database/jobs_seeder.sql`
- 25-30 jobs realistas en 10 empresas
- Fix/reemplazar el `seeder.sql` viejo (usa schema anterior, esta roto)

#### DATA-2: Init Script
- `database/init.sql` - Corre schema + seeders en orden
- Montar en docker-compose como `/docker-entrypoint-initdb.d/init.sql`

#### TEST-1: Tests Backend
- Instalar `vitest`, tests para auth, profiles, jobs
- Actualizar script `test` en `package.json`

#### TEST-2: Tests Frontend
- Instalar `vitest` + `@testing-library/react`
- Tests para Login, JobCard, Dashboard

#### DOC-1: README mejorado
- Overview, arquitectura, setup, API endpoints, tech stack badges

---

## Entregable: CSV para Jira

Generar `jira_tasks.csv` con columnas:
`Epic,Story,Task,Summary,Description,Story Points,Priority,Labels`

Incluye las 21 stories desglosadas en tasks importables a Jira.

---

## Resumen de Tareas para Jira

| Epic | Stories | Story Points |
|------|---------|-------------|
| FE - Frontend | 6 stories | ~18 SP |
| BE - Backend | 4 stories | ~7 SP |
| DATA - Datos | 2 stories | ~4 SP |
| DOCK - Docker/Nginx | 2 stories | ~4 SP |
| CICD - GitHub Actions | 2 stories | ~6 SP |
| K8S - Kubernetes | 2 stories | ~7 SP |
| TEST - Testing | 2 stories | ~8 SP |
| DOC - Documentacion | 1 story | ~2 SP |
| **Total** | **21 stories** | **~56 SP** |

---

## Verificacion

1. `docker-compose up` - todo levanta sin errores (api, postgres, frontend, nginx)
2. Navegar a Landing page en `/`
3. Registrar usuario -> Login -> ver Dashboard con jobs
4. Click en un job -> ver detalle -> marcar favorito
5. Ir a Analytics -> ver graficas con datos
6. Ir a About -> ver info del proyecto
7. `kubectl apply -k k8s/` -> verificar pods running
8. Push a GitHub -> verificar que CI pipeline corre
9. `npm test` en backend y frontend -> tests pasan

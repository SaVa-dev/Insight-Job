# Insight Job
Job scrapper for searching the best job options depending on the jobs you're searching for.

## Programs required for running project
- Docker
- Docker Compose
- Start docker daemon or run Docker desktop
- Make

## Configurations needed for running project
You have to define the .env files in the backend and database folders. there's a .env.example file to view what you need to declare in those files. Also be sure to match the docker-compose ports and the .env ports.

## Project commands:
- Start the containers: `make up`
- Stop the containers: `make down`
- Restart the containers: `make restart`
- View containers logs: `make logs`
- Access psql shell: `make psql`



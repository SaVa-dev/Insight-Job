FROM node:24-alpine AS base

WORKDIR /backend

COPY package*.json ./
RUN npm ci

FROM base AS dev
COPY . .

CMD ["npm", "run", "dev"]

FROM base AS prod

ENV NODE_ENV=production

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]

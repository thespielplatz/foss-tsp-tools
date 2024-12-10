# syntax = docker/dockerfile:1

ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-slim AS base

ARG PORT=3000

ENV NODE_ENV=production

WORKDIR /src

# Build
FROM base AS build

#COPY --link package.json package-lock.json . 
# This isn’t working because the dependencies in package-lock.json are specific to the architecture 
# of the machine where npm install was run.
COPY --link package.json .

RUN npm install --production=false

COPY --link . .

RUN npm run build
RUN npm prune

# Run
FROM base

ENV PORT=$PORT
#ENV HOST 0.0.0.0

COPY --from=build /src/.output /src/.output
COPY package.json /src
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]
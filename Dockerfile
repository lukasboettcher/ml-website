FROM python:3.10 AS jupyter-build

WORKDIR /usr/src/app

COPY src/jupyterlite .

RUN sh build.sh

FROM node:16-alpine AS build

WORKDIR /dist/src/app

RUN npm cache clean --force

COPY . .
COPY --from=jupyter-build /usr/src/jupyterlite-root src/jupyterlite-root
RUN npm ci
RUN npm run build -- --base-href /ki-labor/

FROM nginx:1.22-alpine AS webserver

COPY --from=build /dist/src/app/dist/ml-website /usr/share/nginx/html
# COPY dist/ml-website /usr/share/nginx/html
COPY nginx.conf  /etc/nginx/conf.d/default.conf

LABEL traefik.enable=true
LABEL traefik.http.routers.nginx.entrypoints=http
LABEL traefik.http.routers.nginx.rule="Host(`localhost`) && PathPrefix(`/ki-labor`)"
LABEL traefik.http.middlewares.test-stripprefix.stripprefix.prefixes="/ki-labor"
LABEL traefik.http.routers.nginx.middlewares=test-stripprefix@docker

EXPOSE 80
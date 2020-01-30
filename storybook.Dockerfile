FROM node:10-alpine AS BUILD

WORKDIR /project

RUN npm version $VERSION

COPY . /project

RUN npm i
RUN npm run build
RUN npm run build-storybook

#NGINX
FROM nginx:1-alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /project/storybook-static/ /app/storybook

EXPOSE 80

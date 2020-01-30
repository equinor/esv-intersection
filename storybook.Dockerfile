FROM node:10-alpine AS BUILD

WORKDIR /project

RUN npm version $VERSION

COPY . /project

RUN npm i
RUN npm run build

#NGINX
FROM nginx:1-alpine
WORKDIR /app
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /project/ /app/storybook

EXPOSE 6006:80

CMD ["npm", "run", "storybook"]
FROM node:16.2-alpine3.11 as build

RUN apk --no-cache add make python git

WORKDIR /mobile
COPY ./mobile /mobile

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN yarn
RUN npm run build

FROM nginx:alpine
COPY --from=build /mobile/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./mobile/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
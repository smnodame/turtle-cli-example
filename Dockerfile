FROM node:16-alpine as builder

ENV NODE_ENV=production

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN apk update \
  && apk upgrade \
  && apk add --no-cache \
  make python3 git
 
WORKDIR /app
COPY . /app

RUN npm install --legacy-peer-deps

RUN npm run build

FROM nginx:stable-alpine

RUN apk update \
  && apk upgrade
  
RUN rm -rf  /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

RUN rm -rf /etc/nginx/conf.d/*
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]

EXPOSE 80
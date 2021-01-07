FROM node:15.4.0 as build
WORKDIR /mobile
COPY ./mobile /mobile
RUN yarn
RUN yarn run build .env.production

FROM nginx:alpine
COPY --from=build /mobile/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY ./mobile/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
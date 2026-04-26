FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_API_READ_ACCESS_TOKEN
ARG VITE_CEREBRAS_API_KEY

ENV VITE_API_READ_ACCESS_TOKEN=$VITE_API_READ_ACCESS_TOKEN
ENV VITE_CEREBRAS_API_KEY=$VITE_CEREBRAS_API_KEY

RUN npm run build
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
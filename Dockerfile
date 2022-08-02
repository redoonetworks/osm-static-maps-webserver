FROM node:16 AS build-env

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

COPY config.dist.js ./config.js

RUN npm install

COPY . .

# Distroless application

FROM gcr.io/distroless/nodejs:16

COPY --from=build-env /usr/src/app /app

WORKDIR /app

EXPOSE 3001

CMD ["server.js"]
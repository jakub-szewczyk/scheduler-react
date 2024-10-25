# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.11.1

FROM node:${NODE_VERSION}-alpine AS build
ARG VITE_API_BASE_URL=http://127.0.0.1:3000/api
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_VAPID_PUBLIC_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_VAPID_PUBLIC_KEY=$VITE_VAPID_PUBLIC_KEY

WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine
EXPOSE 5173
RUN npm i -g serve
COPY --from=build /usr/src/app/dist /usr/src/app/dist
CMD ["serve", "-s", "/usr/src/app/dist", "-l", "5173"]

# Stage 1: Build the app
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# Stage 2: Serve the app
FROM node:18

RUN npm install -g serve

WORKDIR /app

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "8080"]
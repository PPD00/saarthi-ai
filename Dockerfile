# Use Node 20 (required by Vite)
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "0.0.0.0:8080"]
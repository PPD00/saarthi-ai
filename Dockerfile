FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 8080

# IMPORTANT FIX HERE 👇
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:8080"]
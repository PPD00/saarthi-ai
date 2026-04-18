FROM node:18

WORKDIR /app

COPY package*.json ./

# IMPORTANT: install ALL deps (not production only)
RUN npm install

COPY . .

# force vite to be available
RUN npm install vite

RUN npm run build

# serve build output
RUN npm install -g serve

EXPOSE 8080

CMD ["serve", "-s", "dist", "-l", "0.0.0.0:8080"]
# backend/Dockerfile

FROM node:22.2.0
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]

# With Compilation
# Étape 1 : Construire l'application VueJS
FROM node:22 AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Without compilation
# Étape 1 : Copier les fichiers de construction dans l'image
# FROM nginx:alpine AS build-stage
# WORKDIR /app
# COPY dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
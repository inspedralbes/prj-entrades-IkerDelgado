FROM node:20-alpine

WORKDIR /usr/src/app

# Copiamos solo los archivos de configuración primero para aprovechar la caché de Docker
COPY package*.json ./

RUN npm install

# Copiamos el resto del código del frontend
COPY . .

EXPOSE 5173

# Iniciamos el servidor de desarrollo de Vite con --host para acceso externo
CMD ["npm", "run", "dev", "--", "--host"]


FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production
# Copiamos el resto del código
COPY . .
# Puerto en el que corre la app
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "index.js"]
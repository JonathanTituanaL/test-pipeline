# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instalamos todas las dependencias (incluyendo devDependencies necesarias para build)
RUN npm install

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto NestJS (de TypeScript a JS)
RUN npm run build


# Etapa 2: Runtime
FROM node:18-alpine AS runner

WORKDIR /app

COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm install --only=production

# Copiamos el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Puerto de la app
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/main.js"]

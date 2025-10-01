# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Instalamos dependencias (incluyendo devDependencies necesarias para build)
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto NestJS (de TypeScript a JS)
RUN npm run build


# Etapa 2: Runtime
FROM node:18-alpine AS runner

WORKDIR /app

# Copiamos solo package.json y package-lock.json
COPY package*.json ./

# Instalamos solo dependencias de producción
RUN npm ci --only=production

# Copiamos el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Puerto de la app
EXPOSE 3000

# Opcional: usar usuario no root por seguridad
RUN addgroup -S app && adduser -S app -G app
USER app

# Comando de inicio
CMD ["node", "dist/main.js"]

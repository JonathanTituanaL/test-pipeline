# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiamos package.json y package-lock.json
COPY package*.json ./

# Instalamos TODAS las dependencias (incluyendo devDependencies necesarias para compilar)
RUN npm ci

# Copiamos el resto del código
COPY . .

# Compilamos el proyecto (NestJS → JS)
RUN npm run build


# Etapa 2: Runtime
FROM node:18-alpine AS runner

WORKDIR /app

# Copiamos solo package.json y package-lock.json
COPY package*.json ./

# Instalamos SOLO dependencias productivas
RUN npm ci --omit=dev

# Copiamos el build desde la etapa anterior
COPY --from=builder /app/dist ./dist

# Exponemos el puerto de la app
EXPOSE 3000

# (Opcional) Seguridad extra: usuario no root
RUN addgroup -S app && adduser -S app -G app
USER app

# Comando de inicio
CMD ["node", "dist/main.js"]

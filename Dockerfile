# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь проект
COPY . .

# Собираем NestJS
RUN npm run build

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

# Копируем сборку
COPY --from=builder /app/dist ./dist
COPY prisma ./prisma

# Экспортируем порт
EXPOSE 4242

# Запуск
CMD ["node", "dist/src/main.js"]

# Используем официальный образ bun
FROM oven/bun:1.4.0

WORKDIR /usr/src/app

# Копируем package.json и lockfile для кэширования установки зависимостей
COPY package.json bun.lock bun.lockb ./

# Устанавливаем зависимости согласно lockfile
RUN bun install --frozen-lockfile

# Копируем весь проект
COPY . .

# Генерируем Prisma client (на случай, если schema уже в проекте)
RUN bun prisma generate

# Собираем проект (у тебя должен быть script "build" в package.json)
RUN bun run build

# Копируем (или создаём) entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 4242

# ENV NODE_ENV=production
ENV NODE_ENV=development

CMD ["/usr/local/bin/docker-entrypoint.sh"]

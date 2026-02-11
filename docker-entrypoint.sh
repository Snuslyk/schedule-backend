#!/usr/bin/env bash
set -euo pipefail

# Ожидаем переменные
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"

echo "Waiting for database $DB_HOST:$DB_PORT..."

# Ждём открытия TCP-порта (bash /dev/tcp)
while ! (exec 3<>/dev/tcp/"$DB_HOST"/"$DB_PORT") >/dev/null 2>&1; do
  printf '.'
  sleep 1
done

echo ""
echo "Database is reachable, running migrations..."

# Выполнить миграции (prisma migrate deploy)
bun prisma migrate deploy

# Генерируем prisma client ещё раз на всякий случай
bun prisma generate

echo "Starting application..."
# Запускать скрипт старта из package.json, например "start:prod"
exec bun run start:prod

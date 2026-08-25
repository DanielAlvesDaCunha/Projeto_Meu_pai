#!/bin/sh
set -e

echo "Waiting for Postgres ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done
echo "Postgres is up."

if [ -z "$DATABASE_URL" ]; then
  export DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"
fi

npx prisma db push --accept-data-loss
npm run seed || true

exec npm run dev

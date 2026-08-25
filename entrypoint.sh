#!/bin/sh
set -e

mkdir -p /suculentas_app/staticfiles /suculentas_app/media

echo "Waiting for Postgres ($POSTGRES_HOST:$POSTGRES_PORT)..."
while ! nc -z "$POSTGRES_HOST" "$POSTGRES_PORT"; do
  sleep 1
done
echo "Postgres is up."

python manage.py collectstatic --noinput
python manage.py makemigrations catalog --noinput
python manage.py migrate --noinput
python manage.py seed_catalog || true

exec python manage.py runserver 0.0.0.0:8000

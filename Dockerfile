FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /suculentas_app

RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    libjpeg62-turbo \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

COPY ./suculentas_app/requirements.txt /tmp/requirements.txt
RUN pip install -r /tmp/requirements.txt

COPY ./suculentas_app /suculentas_app
COPY ./scripts /scripts
COPY ./entrypoint.sh /entrypoint.sh

RUN adduser --disabled-password --no-create-home duser \
    && mkdir -p /suculentas_app/staticfiles /suculentas_app/media \
    && chown -R duser:duser /suculentas_app \
    && chmod -R +x /scripts \
    && chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]

FROM node:20-bookworm-slim

ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=development

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    openssl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY web/package.json web/package-lock.json ./
COPY web/prisma ./prisma
RUN npm ci

COPY web ./
COPY entrypoint.sh /entrypoint.sh
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh \
    && npx prisma generate

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]

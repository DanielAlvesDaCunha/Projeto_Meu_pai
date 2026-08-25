#!/bin/sh
# Sobe o site de novo se cair
cd "$(dirname "$0")/.."
docker compose up -d --build
docker compose ps

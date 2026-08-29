# Cantinho das Suculentas

Loja em **Docker + Django + Bootstrap**, no padrão do [FuzzyLab repo-DRF](https://github.com/FuzzyLab-UVA/repo-DRF): `docker compose up`, Postgres e site com catálogo.

Vendas pelo WhatsApp. Cadastro de produtos e fotos no admin Django.

## Subir o site

```bash
cp dotenv_files/.env-example dotenv_files/.env
docker compose up --build -d
```

Site: http://127.0.0.1:43127  
Admin: http://127.0.0.1:43127/admin/

Se cair:

```bash
docker compose up -d
# ou
./scripts/up.sh
```

## Configurar WhatsApp

Em `dotenv_files/.env`:

```
WHATSAPP_NUMBER=5521988162338
WHATSAPP_LABEL=(21) 98816-2338
STORE_NAME=Paulo Suculentas
```

## Fotos e produtos

1. Crie um admin: `docker compose exec suculentas_django python manage.py createsuperuser`
2. Entre em `/admin/` e cadastre produtos com foto
3. Ou rode o seed: `docker compose exec suculentas_django python manage.py seed_catalog`

## Sobre fotos do WhatsApp

Não dá para puxar automaticamente as fotos das conversas do WhatsApp de forma oficial e estável. O caminho certo: tire a foto → suba no admin do site → se quiser, envie a mesma imagem no WhatsApp.

## Estrutura

```
docker-compose.yml
Dockerfile
entrypoint.sh
dotenv_files/
suculentas_app/   # Django
scripts/up.sh     # sobe de novo se cair
```

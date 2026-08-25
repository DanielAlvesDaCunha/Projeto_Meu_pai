# Deploy / produção (Vercel)

## 1. Banco (Neon)

1. Crie um projeto em [Neon](https://neon.tech) e copie a connection string.
2. Na Vercel → Project → Settings → Environment Variables:
   - `DATABASE_URL` = connection string do Neon (`?sslmode=require`)
3. Nunca use `suculentas_psql` na Vercel (hostname só existe no Docker).

No build/deploy, rode as migrations:

```bash
cd web
npx prisma db push
# ou: npx prisma migrate deploy
npm run seed
```

No Docker local o `entrypoint.sh` já faz `db push` + seed.

## 2. Auth

Defina:

- `AUTH_SECRET` — string longa aleatória
- `AUTH_URL` / `NEXTAUTH_URL` — URL pública do site (ex.: `https://seu-app.vercel.app`)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — admin criado no seed

Login admin: `/entrar` → depois `/admin`

## 3. Fotos (Vercel Blob)

1. Vercel → Storage → Blob → Create
2. Variável `BLOB_READ_WRITE_TOKEN` (gerada automaticamente)
3. Upload no admin usa Blob em produção; no Docker grava em `public/media`

## 4. Pagar.me (Pix)

1. Conta em [Pagar.me](https://pagar.me) (Stone) com CNPJ
2. Gere a **Secret Key** no dashboard (sandbox: `sk_test_...`)
3. Variáveis na Vercel:
   - `PAYMENT_PROVIDER=pagarme`
   - `PAGARME_SECRET_KEY=sk_test_...` (ou `sk_...` em produção)
   - `PAGARME_WEBHOOK_SECRET=um-token-seu`
4. Webhook no painel Pagar.me apontando para:
   `https://seu-dominio/api/webhooks/pagarme?token=SEU_TOKEN`
   (ou header `x-webhook-token` com o mesmo valor)

Sem `PAGARME_SECRET_KEY`, o checkout continua com WhatsApp.

## 5. Checklist rápido

- [ ] Neon `DATABASE_URL`
- [ ] `AUTH_SECRET` + `AUTH_URL`
- [ ] Seed admin
- [ ] Blob token (fotos)
- [ ] Pagar.me key + webhook (Pix)

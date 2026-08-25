# Deploy / produção (Vercel)

## 1. Banco (Neon) — **obrigatório para login e admin**

Sem `DATABASE_URL` na Vercel o site abre, mas **login e admin não funcionam**.

### Passo a passo na Vercel

1. Abra o projeto na [Vercel Dashboard](https://vercel.com/dashboard)
2. **Storage** → **Create Database** → **Postgres** (Neon)
3. Conecte ao projeto — a Vercel cria `DATABASE_URL` automaticamente
4. Confira em **Settings → Environment Variables**:
   - `DATABASE_URL` deve ser algo como `postgresql://...@...neon.tech/...?sslmode=require`
   - **Não** pode conter `suculentas_psql` (isso é só Docker local)
5. Adicione também (se ainda não tiver):
   - `AUTH_SECRET` — string longa aleatória (32+ caracteres)
   - `AUTH_URL` = `https://seu-dominio.vercel.app`
   - `NEXTAUTH_URL` = mesma URL
   - `ADMIN_EMAIL` — e-mail do lojista (use o e-mail que ele usa para entrar). Se a conta já existir, o seed **promove para admin sem mudar a senha**.
   - `ADMIN_PASSWORD` — senha só para criar admin novo (padrão `Admin123!`)
6. **Redeploy** (Deployments → ⋯ → Redeploy)

O build roda `prisma db push` + `seed` e cria as tabelas + usuário admin.

### Testar local (Docker)

```bash
docker compose up -d --build
```

Login local: http://127.0.0.1:43127/entrar

## 2. Auth

Defina:

- `AUTH_SECRET` — string longa aleatória
- `AUTH_URL` / `NEXTAUTH_URL` — URL pública do site (ex.: `https://seu-app.vercel.app`)
- `ADMIN_EMAIL` — e-mail do administrador (pode ser o e-mail que seu pai já usa no `/cadastro`)
- `ADMIN_PASSWORD` — senha inicial se o admin ainda não existir no banco

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

# Cantinho das Suculentas

Catálogo HTML simples no estilo de loja online (grade de produtos, banner, botão Comprar), com pedido pelo WhatsApp.

Referência visual: lojas como BNS Plantas e Suculentas Holambra.

## Como rodar

```bash
python3 -m http.server 43127
```

Abra: http://127.0.0.1:43127

## Configurar

1. Em `app.js`, altere `WHATSAPP` e `WHATSAPP_LABEL`.
2. Edite as listas `destaques` e `maisVendidos`.
3. Fotos próprias: pasta `fotos/` e caminho `fotos/nome.jpg`.

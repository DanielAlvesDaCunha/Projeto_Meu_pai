# Cantinho das Suculentas

Site simples em HTML para catálogo de suculentas com pedido pelo WhatsApp.

## Como rodar

Na pasta do projeto:

```bash
python3 -m http.server 43127
```

Abra: http://127.0.0.1:43127

## Configurar

1. Em `app.js`, troque `WHATSAPP` pelo número com DDI (ex.: `5511999999999`).
2. Edite a lista `plantas` (nome, preço, descrição, foto).
3. Para fotos próprias: coloque imagens na pasta `fotos/` e use caminhos como `fotos/echeveria.jpg`.

## Fluxo sugerido das fotos

O site é a fonte das fotos. Tire a foto uma vez, use no site e, se quiser, envie a mesma imagem no WhatsApp para o cliente. Não dá para puxar automaticamente as fotos do WhatsApp de forma simples.

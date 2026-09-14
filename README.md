# POZZANI Advocacia — site estático

Réplica do site original (`pozzani-advocacia.atlasdig.chatgpt.site`), pronta para subir no GitHub + Vercel.

## O que foi removido em relação ao HTML original

- Script injetado pelo **antivírus Kaspersky** (`me.kis.v2.scr.kaspersky-labs.com` / `gc.kis.v2.scr.kaspersky-labs.com`) — não faz parte do site, é injetado localmente pelo software instalado em quem tirou o "ver código-fonte".
- Script de **challenge do Cloudflare** (bloco `__CF$cv$params`) — injetado automaticamente pelo CDN no momento da requisição, não é código-fonte do projeto. A Vercel tem proteção própria; não é necessário replicar isso.

Nenhum outro código, classe, texto ou estrutura foi alterado.

## ⚠️ Arquivos que ainda faltam para ficar 100% idêntico

O upload que recebi não trouxe todos os assets referenciados no CSS/HTML. Faltam:

### Imagens
- [x] `assets/pozzani-logo.png` ✅ recebido
- [ ] `assets/columns-hero.webp` (imagem de fundo do hero — **chegou vazia/0 bytes em todas as tentativas de upload**. Tente exportar de novo a partir do arquivo original, ou me envie em outro formato como .jpg/.png que eu converto)
- [x] `assets/depoimento-renan-mello.png` ✅ recebido
- [x] `assets/depoimento-kelsilene-rodrigues.png` ✅ recebido
- [x] `assets/depoimento-graziele-lima.png` ✅ recebido
- [x] `assets/depoimento-joao-lucas.png` ✅ recebido
- [x] `assets/depoimento-luzia-soares.png` ✅ recebido
- [x] `assets/depoimento-filipe-silva.png` ✅ recebido
- [x] `assets/depoimento-janaina-araujo.png` ✅ recebido

### Fontes (opcional — já existe fallback via Google Fonts em `assets/fonts.css`)
- [ ] `assets/fonts/playfair-display-500-normal.ttf` (peso 500 não-itálico — só temos a itálica)
- [ ] `assets/fonts/manrope-400-normal.ttf`, `manrope-500-normal.ttf`, `manrope-600-normal.ttf` (só temos o peso 700)

Sem esses arquivos de fonte, o site funciona normalmente (o `fonts.css` já importa os pesos que faltam via Google Fonts como fallback), mas para ficar 100% auto-hospedado (sem depender do Google Fonts), envie os `.ttf` que faltam e remova a linha `@import` no final de `assets/fonts.css`.

## Estrutura de pastas

```
pozzani-advocacia/
├── index.html
├── politica-de-privacidade.html
├── styles.css
├── script.js
└── assets/
    ├── fonts.css
    ├── bruno-pozzani.png
    ├── pozzani-logo.png
    ├── depoimento-renan-mello.png
    ├── depoimento-kelsilene-rodrigues.png
    ├── depoimento-graziele-lima.png
    ├── depoimento-joao-lucas.png
    ├── depoimento-luzia-soares.png
    ├── depoimento-filipe-silva.png
    ├── depoimento-janaina-araujo.png
    ├── columns-hero.webp        (FALTANDO — reenviar, veio vazio)
    └── fonts/
        ├── manrope-700-normal.ttf
        └── playfair-display-500-italic.ttf
```

## Como subir no GitHub

```bash
cd pozzani-advocacia
git init
git add .
git commit -m "Site inicial POZZANI Advocacia"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/pozzani-advocacia.git
git push -u origin main
```

## Como fazer o deploy na Vercel

1. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório do GitHub.
2. Como é um site estático (HTML/CSS/JS puro, sem build), configure:
   - **Framework Preset:** Other
   - **Build Command:** (deixe em branco)
   - **Output Directory:** `.` (raiz)
3. Deploy.

## Próximos passos sugeridos (tráfego pago)

- Adicionar Meta Pixel + GA4 no `<head>` do `index.html` antes de rodar campanhas.
- Criar landing pages segmentadas por área de atuação (ex: `/trabalhista-bancario.html`) para campanhas de Google Ads com melhor Quality Score.

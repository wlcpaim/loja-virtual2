# Loja Virtual2

Loja virtual com vitrine, filtros por categoria, busca, ordenação, página de produto, carrinho com frete e checkout, e painel admin (produtos, estoque, categorias, pedidos, inscritos e configurações).

## Páginas
- `index.html`
- `item.html`
- `cart.html`
- `content.html`
- `search.html`
- `admin.html`

## Painel admin
Acesse `admin.html`. No primeiro acesso você define a senha do painel.

Importante: nesta versão o conteúdo e a senha ficam salvos **no navegador** (localStorage). Para vários administradores, pedidos reais e pagamentos, conecte um banco de dados e um provedor de pagamento.

## Estrutura
```
css/theme.css   cores e fontes do preset
css/style.css   layout e componentes
js/config.js    conteúdo inicial (produtos, posts, categorias)
js/store.js     dados salvos no navegador
js/site.js      páginas públicas
js/admin.js     painel administrativo
```

HTML, CSS e JavaScript puros, sem build. Publique como site estático.

---
Criado pelo **WLC.IA Studio**.

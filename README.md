# Loja Virtual2

E-commerce moderno de alto padrão com vitrine interativa, **Cart Drawer lateral deslizante**, simulação de frete por CEP, **sistema de cupons de desconto**, checkout inteligente (**PIX Copia e Cola com 5% OFF**, Cartão até 10x sem juros e Boleto), integração com WhatsApp e **Painel Administrativo Completo**.

---

## 🚀 Funcionalidades Principais

### Experiência do Cliente
- **Vitrine Dinâmica (`index.html`)**: Banner Hero de impacto, barra de pesquisa instantânea, filtros por categoria, ordenação por preço/lançamento e badges promocionais.
- **Mini-Carrinho Lateral (Cart Drawer)**: Sacola deslizante acessível de qualquer página para conferir subtotal e ajustar quantidades sem recarregar a tela.
- **Página de Detalhes (`item.html`)**: Seletor numérico de quantidade, cálculo de parcelas, simulador de frete por CEP em tempo real e botão de compra direta.
- **Carrinho & Checkout (`cart.html`)**:
  - Aplicação de cupons reais (`BEMVINDO10` para 10% OFF, `PROMO15` e `FRETEGRATIS`).
  - Cálculo de frete dinâmico com isenção automática para pedidos acima de R$ 299.
  - Opções de pagamento: **PIX Imediato** (com geração de código Copia e Cola e 5% de desconto extra automático), **Cartão de Crédito** (até 10x sem juros) e **Boleto Bancário**.
  - Botão pós-compra para enviar o resumo do pedido diretamente no WhatsApp da loja com um clique.
- **Busca Global (`search.html`)** e **Páginas Institucionais (`content.html`)**.

### Painel do Lojista (`admin.html`)
- Proteção de acesso com criação e validação de senha no navegador.
- **Métricas em tempo real**: faturamento total, quantidade de pedidos, produtos publicados e mais vendidos.
- **Gestão de Produtos (CRUD)**: cadastro, edição de preços, fotos, estoques e controle de rascunhos.
- **Gestão de Pedidos**: acompanhamento com detalhes dos produtos comprados, endereço, CEP e alteração de status (Novo, Pago, Enviado, Entregue, Cancelado).
- **Newsletter**: exportação de e-mails cadastrados em formato CSV.
- **Configurações**: personalização do nome da loja, slogan, chave Pix e telefone WhatsApp.

---

## 📁 Estrutura de Arquivos

```
loja-virtual2/
├── index.html        # Vitrine com catálogo de produtos
├── item.html         # Página de detalhes e simulador de frete
├── cart.html         # Carrinho e checkout completo
├── search.html       # Busca de produtos
├── content.html      # Páginas institucionais (Sobre, Contato, Políticas)
├── admin.html        # Painel de controle do lojista
├── css/
│   ├── theme.css     # Design tokens, paleta esmeralda, sombras e tipografia
│   └── style.css     # Estilos modernos, Cart Drawer, layout responsivo
└── js/
    ├── config.js     # Configurações iniciais, catálogo padrão e cupons
    ├── store.js      # Camada de persistência em localStorage e lógica de regras
    ├── site.js       # Comportamento interativo do site e checkout
    └── admin.js      # Sistema e telas do painel administrativo
```

---

## 🌐 Como Publicar (GitHub Pages)

O projeto foi construído em **HTML5, CSS3 e JavaScript puro (Vanilla)**, sem necessidade de compilação (*build* ou Node.js).
1. Acesse o repositório no GitHub.
2. Vá em **Settings** > **Pages**.
3. Em **Branch**, selecione `main` e a pasta `/(root)`.
4. Clique em **Save**. O site estará no ar em poucos segundos com HTTPS automático!

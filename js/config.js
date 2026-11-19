/* Conteúdo inicial e configuração do site. Edite livremente. */
window.SITE = {
  "id": "loja-virtual2",
  "name": "Loja Virtual2",
  "kind": "store",
  "tagline": "Produtos selecionados com entrega rápida, troca grátis e pagamento seguro.",
  "topbar": "Frete grátis em compras acima de R$ 299 · Cupom BEMVINDO10 com 10% OFF",
  "phone": "5511999998888",
  "pixKey": "contato@lojavirtual2.com.br",
  "freeShippingFrom": 299,
  "hero": {
    "eyebrow": "Nova Coleção 2026",
    "title": "Design que acompanha o seu dia com elegância",
    "cta": "Explorar Catálogo",
    "ctaHref": "#list",
    "secondary": "Ver Ofertas",
    "secondaryHref": "index.html?cat=acessorios",
    "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    "stats": [
      [
        "Clientes satisfeitos",
        "15 mil+"
      ],
      [
        "Avaliação média",
        "4,9 ★"
      ],
      [
        "Envio Expresso",
        "24-48h"
      ]
    ]
  },
  "listTitle": "Produtos em Destaque",
  "sorts": [
    [
      "recent",
      "Lançamentos"
    ],
    [
      "popular",
      "Mais Vendidos"
    ],
    [
      "price-asc",
      "Menor Preço"
    ],
    [
      "price-desc",
      "Maior Preço"
    ]
  ],
  "labels": {
    "items": "Produtos",
    "item": "Produto"
  },
  "moderate": false,
  "categories": [
    {
      "id": "relogios",
      "name": "Relógios"
    },
    {
      "id": "audio",
      "name": "Áudio & Tecnologia"
    },
    {
      "id": "calcados",
      "name": "Calçados"
    },
    {
      "id": "acessorios",
      "name": "Acessórios"
    }
  ],
  "coupons": [
    {
      "code": "BEMVINDO10",
      "discount": 10,
      "type": "percent",
      "desc": "10% de desconto na primeira compra"
    },
    {
      "code": "PROMO15",
      "discount": 15,
      "type": "percent",
      "desc": "15% de desconto especial"
    },
    {
      "code": "FRETEGRATIS",
      "discount": 0,
      "type": "shipping",
      "desc": "Frete Grátis em qualquer valor"
    }
  ],
  "items": [
    {
      "id": "relogio-classic",
      "title": "Relógio Classic Minimal Aço Escovado",
      "category": "relogios",
      "price": 489.9,
      "oldPrice": 629.9,
      "stock": 14,
      "sold": 182,
      "badge": "-22% OFF",
      "rating": 4.9,
      "reviews": 128,
      "image": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Caixa de 40mm em aço escovado, pulseira de couro legítimo e resistência 5 ATM.",
      "body": "Um relógio para todos os momentos. O Classic Minimal combina discrição com presença marcante.\n\nConstruído com caixa em aço inoxidável cirúrgico 316L, vidro mineral temperado antirrisco e maquinário quartz japonês de alta precisão. Acompanha estojo premium com garantia de 2 anos.",
      "date": "2026-11-15T00:00:00.000Z"
    },
    {
      "id": "fone-studio",
      "title": "Headphone Studio Pro Wireless ANC",
      "category": "audio",
      "price": 899,
      "oldPrice": 1149,
      "stock": 22,
      "sold": 240,
      "badge": "Mais Vendido",
      "rating": 5.0,
      "reviews": 215,
      "image": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Cancelamento de ruído ativo inteligente, 40h de autonomia e drivers de titânio.",
      "body": "Imersão sonora absoluta em qualquer ambiente.\n\nEquipado com 4 microfones híbridos para cancelamento de ruído ambiente, drivers dinâmicos de 40mm calibrados para graves profundos e agudos cristalinos. Conexão Bluetooth 5.3 multiponto.",
      "date": "2026-11-08T00:00:00.000Z"
    },
    {
      "id": "tenis-runner",
      "title": "Tênis Runner Nitro Air Carbon",
      "category": "calcados",
      "price": 559.9,
      "oldPrice": 699.9,
      "stock": 9,
      "sold": 133,
      "badge": "Oferta",
      "rating": 4.8,
      "reviews": 94,
      "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Amortecimento responsivo de alta performance e cabedal respirável.",
      "body": "Leveza extrema e retorno de energia a cada passada.\n\nPlaca interna de estabilidade, entressola com espuma de nitrogênio injetado e solado de borracha com alta tração para asfalto e esteira.",
      "date": "2026-11-12T00:00:00.000Z"
    },
    {
      "id": "smartwatch-sport",
      "title": "Smartwatch Sport Pulse OLED",
      "category": "relogios",
      "price": 649,
      "oldPrice": 799,
      "stock": 16,
      "sold": 89,
      "badge": "Lançamento",
      "rating": 4.9,
      "reviews": 67,
      "image": "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Tela AMOLED Always-on, sensor cardíaco de precisão e GPS integrado.",
      "body": "Seu parceiro completo de treinos e saúde diária.\n\nMonitoramento de frequência cardíaca 24h, oxigenação sanguínea (SpO2), análise avançada do sono e resistência à água de até 50 metros.",
      "date": "2026-11-18T00:00:00.000Z"
    },
    {
      "id": "camera-instant",
      "title": "Câmera Instantânea Analógica Retro",
      "category": "acessorios",
      "price": 749,
      "stock": 5,
      "sold": 64,
      "badge": "Últimas un.",
      "rating": 4.7,
      "reviews": 51,
      "image": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Fotos impressas instantaneamente com acabamento analógico retrô e flash inteligente.",
      "body": "Capture momentos especiais e tenha a fotografia física na mão em poucos segundos.\n\nControle automático de exposição, modo selfie com espelho no visor e lente macro para fotos nítidas a curta distância.",
      "date": "2026-11-04T00:00:00.000Z"
    },
    {
      "id": "oculos-sol",
      "title": "Óculos de Sol Aviador Polarizado Titan",
      "category": "acessorios",
      "price": 329.9,
      "stock": 30,
      "sold": 97,
      "rating": 4.9,
      "reviews": 83,
      "image": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Lentes polarizadas com proteção UV400 completa e armação ultraleve.",
      "body": "Visual icônico com proteção total para seus olhos.\n\nLentes polarizadas de policarbonato que eliminam reflexos indesejados e armação flexível de liga leve com pontes em silicone hipoalergênico.",
      "date": "2026-10-29T00:00:00.000Z"
    },
    {
      "id": "perfume-noir",
      "title": "Perfume Noir Eau de Parfum 100ml",
      "category": "acessorios",
      "price": 419,
      "stock": 18,
      "sold": 151,
      "badge": "Exclusivo",
      "rating": 5.0,
      "reviews": 112,
      "image": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Fragrância amadeirada nobre com acordes de bergamota, sândalo e âmbar.",
      "body": "Uma presença sofisticada e inesquecível.\n\nConcentração Eau de Parfum com alta fixação (mais de 10 horas). Notas de cabeça cítricas e especiadas que evoluem para um coração de sândalo e baunilha negra.",
      "date": "2026-11-17T00:00:00.000Z"
    },
    {
      "id": "mochila-urban",
      "title": "Mochila Urbana Roll-Top Impermeável",
      "category": "acessorios",
      "price": 389.9,
      "stock": 15,
      "sold": 73,
      "badge": "Resistente",
      "rating": 4.8,
      "reviews": 46,
      "image": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80",
      "excerpt": "Compartimento acolchoado para notebook de até 16\", lona repelente à água.",
      "body": "Projetada para a rotina dinâmica da cidade.\n\nCapacidade expansível de 20L a 28L com fechamento roll-top seguro. Costas respiráveis com suporte lombar e bolsos secretos para passaporte e carteira.",
      "date": "2026-11-10T00:00:00.000Z"
    }
  ],
  "comments": [],
  "nav": [
    {
      "label": "Início",
      "href": "index.html"
    },
    {
      "label": "Relógios",
      "href": "index.html?cat=relogios"
    },
    {
      "label": "Áudio",
      "href": "index.html?cat=audio"
    },
    {
      "label": "Calçados",
      "href": "index.html?cat=calcados"
    },
    {
      "label": "Acessórios",
      "href": "index.html?cat=acessorios"
    }
  ],
  "footer": [
    {
      "title": "Nossa Loja",
      "links": [
        {
          "label": "Todos os produtos",
          "href": "index.html"
        },
        {
          "label": "Ver carrinho",
          "href": "cart.html"
        },
        {
          "label": "Lançamentos 2026",
          "href": "index.html?sort=recent"
        }
      ]
    },
    {
      "title": "Ajuda & Suporte",
      "links": [
        {
          "label": "Prazos e Entregas",
          "href": "index.html#extra"
        },
        {
          "label": "Trocas e Devoluções",
          "href": "index.html#extra"
        },
        {
          "label": "Perguntas Frequentes",
          "href": "content.html?slug=about"
        }
      ]
    },
    {
      "title": "Institucional",
      "links": [
        {
          "label": "Sobre Nós",
          "href": "content.html?slug=about"
        },
        {
          "label": "Fale Conosco",
          "href": "content.html?slug=contact"
        },
        {
          "label": "Política de Privacidade",
          "href": "content.html?slug=privacy"
        },
        {
          "label": "Termos de Uso",
          "href": "content.html?slug=terms"
        },
        {
          "label": "Painel do Lojista",
          "href": "admin.html"
        }
      ]
    }
  ],
  "extra": "<div class=\"feature-band\"><div><strong>🚚 Frete Grátis</strong><span class=\"muted\">Em compras acima de R$ 299 para todo o Brasil.</span></div><div><strong>🔄 Troca sem Complicações</strong><span class=\"muted\">30 dias para devolução ou troca grátis.</span></div><div><strong>🔒 Pagamento 100% Protegido</strong><span class=\"muted\">Pix com 5% OFF, Cartão em até 10x sem juros e Boleto.</span></div><div><strong>💬 Atendimento Humanizado</strong><span class=\"muted\">Suporte direto no WhatsApp para tirar suas dúvidas.</span></div></div><div class=\"newsletter\"><div><h2>Ganhe 10% de desconto na primeira compra</h2><p>Use o cupom <strong>BEMVINDO10</strong> no checkout ou assine nossa newsletter para novidades.</p></div><form data-newsletter><input class=\"input\" type=\"email\" name=\"email\" required placeholder=\"Digite seu melhor e-mail\" aria-label=\"E-mail\" /><button class=\"btn\">Quero meu cupom</button></form></div>",
  "pagesContent": {
    "about": {
      "title": "Sobre Nós",
      "body": "Nascemos com a missão de oferecer produtos que combinam tecnologia, sofisticação e funcionalidade.\n\nTrabalhamos com marcas e parceiros rigorosamente auditados para entregar produtos que você terá orgulho de usar e presentear."
    },
    "contact": {
      "title": "Fale Conosco",
      "body": "Estamos sempre disponíveis para esclarecer dúvidas, auxiliar na escolha do seu produto ou acompanhar a sua entrega.\n\nAtendimento via WhatsApp e E-mail: Segunda a Sábado das 09h às 19h."
    },
    "privacy": {
      "title": "Política de Privacidade",
      "body": "Sua privacidade é prioridade absoluta. Todos os dados coletados durante o processo de compra são protegidos por criptografia de ponta a ponta e utilizados exclusivamente para o faturamento e entrega segura dos seus pedidos."
    },
    "terms": {
      "title": "Termos de Uso",
      "body": "Ao utilizar nossa loja virtual, você tem garantia de receber exatamente os produtos descritos com nota fiscal, rastreamento ativo e direito incondicional de desistência em até 7 dias corridos após o recebimento, além da garantia contratual estendida da loja."
    }
  }
};

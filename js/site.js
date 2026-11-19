/* Site público: cabeçalho moderno, cart drawer, vitrine, detalhe, cupons, frete e checkout */
(function () {
  var C = window.SITE || {}, db = DB.get(), page = document.body.dataset.page;
  var $ = function (s) { return document.querySelector(s); };
  var qs = new URLSearchParams(location.search);

  // Estado local para simulação de checkout
  var state = {
    selectedShipping: null, // { id, name, price, deadline }
    shippingList: null,
    paymentMethod: "pix", // 'pix', 'card', 'boleto'
    itemDetailQty: 1
  };

  var ICONS = {
    bag: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>',
    check: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
    truck: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>',
    shield: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
    trash: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
  };

  /* ========================================================================
     1. Cabeçalho & Menu
     ======================================================================== */
  function header() {
    var cartCount = DB.cartCount();
    var links = (C.nav || []).map(function (n) { return '<a href="' + n.href + '">' + esc(n.label) + "</a>"; }).join("");
    var headerEl = $("#site-header");
    if (!headerEl) return;

    headerEl.innerHTML =
      (C.topbar ? '<div class="topbar">' + esc(C.topbar) + "</div>" : "") +
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="index.html"><span class="brand-mark">' + esc(db.settings.name.charAt(0)) + "</span>" + esc(db.settings.name) + "</a>" +
      '<button class="menu-toggle" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu"><span></span><span></span><span></span></button>' +
      '<nav id="menu" class="nav" aria-label="Principal">' + links +
      (C.kind === "store" ? '<button class="cart-btn-header" id="cart-drawer-trigger" aria-label="Abrir carrinho">' + ICONS.bag + ' <span>Carrinho</span> <span class="badge" id="header-cart-badge">' + cartCount + "</span></button>" : "") +
      '<a href="search.html" aria-label="Buscar">Buscar</a><a class="nav-admin" href="admin.html">Painel Admin</a></nav></div></header>';

    var t = $(".menu-toggle"), m = $("#menu");
    if (t && m) {
      t.addEventListener("click", function () {
        var o = m.classList.toggle("is-open");
        t.setAttribute("aria-expanded", String(o));
      });
    }

    var drawerBtn = $("#cart-drawer-trigger");
    if (drawerBtn) {
      drawerBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openDrawer();
      });
    }
  }

  function updateCartBadge() {
    var count = DB.cartCount();
    var b = $("#header-cart-badge");
    if (b) {
      b.textContent = count;
      b.classList.remove("pulse");
      void b.offsetWidth;
      b.classList.add("pulse");
    }
  }

  /* ========================================================================
     2. Mini-Carrinho Lateral (Cart Drawer)
     ======================================================================== */
  function setupDrawer() {
    if (C.kind !== "store" || $("#cart-drawer-wrap")) return;

    var wrap = document.createElement("div");
    wrap.id = "cart-drawer-wrap";
    wrap.innerHTML =
      '<div class="drawer-backdrop" id="drawer-backdrop"></div>' +
      '<aside class="cart-drawer" id="cart-drawer" aria-label="Carrinho de Compras lateral" role="dialog" aria-modal="true">' +
      '  <div class="drawer-head"><h3>Sacola de Compras</h3><button class="drawer-close" id="drawer-close" aria-label="Fechar carrinho">&times;</button></div>' +
      '  <div class="drawer-body" id="drawer-items"></div>' +
      '  <div class="drawer-foot" id="drawer-foot"></div>' +
      '</aside>';
    document.body.appendChild(wrap);

    $("#drawer-close").addEventListener("click", closeDrawer);
    $("#drawer-backdrop").addEventListener("click", closeDrawer);

    // Delegação de eventos de quantidade dentro do Drawer
    $("#drawer-items").addEventListener("click", function (e) {
      var delBtn = e.target.closest("[data-drawer-del]");
      if (delBtn) {
        var idToDel = delBtn.dataset.drawerDel;
        db.cart = db.cart.filter(function (x) { return String(x.id) !== String(idToDel); });
        DB.save();
        updateCartBadge();
        renderDrawer();
        if (page === "cart") cart();
        toast("Produto removido do carrinho");
        return;
      }

      var qBtn = e.target.closest("[data-drawer-q]");
      if (!qBtn) return;
      var id = qBtn.dataset.id;
      var delta = Number(qBtn.dataset.drawerQ);
      var l = db.cart.find(function (x) { return String(x.id) === String(id); });
      if (!l) return;
      var item = DB.item(l.id);

      if (delta > 0 && item && item.stock !== undefined && l.qty >= item.stock) {
        toast("Estoque máximo: " + item.stock + " un.");
        return;
      }

      l.qty += delta;
      if (l.qty <= 0) {
        db.cart = db.cart.filter(function (x) { return String(x.id) !== String(id); });
      }
      DB.save();
      updateCartBadge();
      renderDrawer();
      if (page === "cart") cart();
    });
  }

  function openDrawer() {
    renderDrawer();
    var d = $("#cart-drawer"), b = $("#drawer-backdrop");
    if (d && b) {
      d.classList.add("is-open");
      b.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
  }

  function closeDrawer() {
    var d = $("#cart-drawer"), b = $("#drawer-backdrop");
    if (d && b) {
      d.classList.remove("is-open");
      b.classList.remove("is-open");
      document.body.style.overflow = "";
    }
  }

  function renderDrawer() {
    var itemsBox = $("#drawer-items"), footBox = $("#drawer-foot");
    if (!itemsBox || !footBox) return;

    var lines = (db.cart || []).map(function (l) {
      return { l: l, i: DB.item(l.id) };
    }).filter(function (x) { return x.i; });

    var subtotal = lines.reduce(function (s, x) { return s + (x.i.price || 0) * x.l.qty; }, 0);

    if (!lines.length) {
      itemsBox.innerHTML =
        '<div class="drawer-empty">' +
        '  <div style="font-size:3rem;opacity:0.4;">🛒</div>' +
        '  <h4>Sua sacola está vazia</h4>' +
        '  <p class="muted small">Aproveite as ofertas do nosso catálogo!</p>' +
        '  <button class="btn btn-secondary" onclick="document.getElementById(\'drawer-close\').click()">Explorar Loja</button>' +
        '</div>';
      footBox.innerHTML = "";
      return;
    }

    itemsBox.innerHTML = lines.map(function (x) {
      return '<div class="drawer-item">' +
        '<img src="' + esc(x.i.image) + '" alt="' + esc(x.i.title) + '" />' +
        '<div>' +
        '  <div class="drawer-item-title">' + esc(x.i.title) + '</div>' +
        '  <div class="drawer-item-price">' + money(x.i.price) + '</div>' +
        '  <div class="qty" style="margin-top:.4rem;">' +
        '    <button data-drawer-q="-1" data-id="' + esc(x.i.id) + '" aria-label="Diminuir">−</button>' +
        '    <span>' + x.l.qty + '</span>' +
        '    <button data-drawer-q="1" data-id="' + esc(x.i.id) + '" aria-label="Aumentar">+</button>' +
        '  </div>' +
        '</div>' +
        '<button class="link danger" data-drawer-del="' + esc(x.i.id) + '" title="Remover item" style="padding:.4rem;">' + ICONS.trash + '</button>' +
        '</div>';
    }).join("");

    footBox.innerHTML =
      '<div class="drawer-subtotal"><span>Subtotal</span><strong>' + money(subtotal) + '</strong></div>' +
      '<p class="muted small" style="margin:0;">Frete e descontos calculados na etapa final.</p>' +
      '<a class="btn btn-block btn-lg" href="cart.html" onclick="document.getElementById(\'drawer-close\').click()">Finalizar Compra</a>' +
      '<button class="btn btn-ghost btn-block" onclick="document.getElementById(\'drawer-close\').click()">Continuar Comprando</button>';
  }

  /* ========================================================================
     3. Rodapé
     ======================================================================== */
  function footer() {
    var footerEl = $("#site-footer");
    if (!footerEl) return;
    footerEl.innerHTML = '<footer class="site-footer"><div class="container footer-grid"><div><div class="brand">' + esc(db.settings.name) + '</div><p class="muted">' + esc(db.settings.tagline) + "</p></div>" +
      (C.footer || []).map(function (col) {
        return "<div><h4>" + esc(col.title) + "</h4>" + (col.links || []).map(function (l) {
          return '<a href="' + l.href + '">' + esc(l.label) + "</a>";
        }).join("") + "</div>";
      }).join("") +
      '</div><div class="container footer-bottom"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;"><span>© ' + new Date().getFullYear() + " " + esc(db.settings.name) + '. Todos os direitos reservados.</span><span style="display:inline-flex;gap:.75rem;font-size:1.2rem;">🔒 💳 ⚡</span></div></div></footer>';
  }

  function cat(id) {
    var c = (db.categories || []).find(function (x) { return x.id === id; });
    return c ? c.name : "";
  }

  /* ========================================================================
     4. Card de Produto Moderno
     ======================================================================== */
  function card(i) {
    var href = "item.html?id=" + encodeURIComponent(i.id);
    var isOutOfStock = i.stock !== undefined && i.stock <= 0;
    var isLowStock = i.stock !== undefined && i.stock > 0 && i.stock <= 5;

    var badgeHtml = "";
    if (i.badge) {
      var badgeClass = i.badge.indexOf("%") >= 0 ? "chip sale" : "chip";
      badgeHtml = '<span class="' + badgeClass + '">' + esc(i.badge) + '</span>';
    } else if (isLowStock) {
      badgeHtml = '<span class="chip low-stock">Últimas ' + i.stock + ' un.</span>';
    }

    var ratingHtml = i.rating ?
      '<div class="rating-row"><span class="rating-stars">★★★★★</span><span>' + Number(i.rating).toFixed(1) + ' (' + (i.reviews || 0) + ')</span></div>' : '';

    var buttonHtml = "";
    if (C.kind === "store") {
      if (isOutOfStock) {
        buttonHtml = '<button class="btn btn-block btn-ghost" disabled>Esgotado</button>';
      } else {
        buttonHtml = '<button class="btn btn-block" data-add="' + esc(i.id) + '">' + ICONS.bag + ' Adicionar</button>';
      }
    }

    return '<article class="card">' +
      '<a href="' + href + '" class="card-media">' +
      '  <img loading="lazy" src="' + esc(i.image) + '" alt="' + esc(i.title) + '" />' + badgeHtml +
      '</a>' +
      '<div class="card-body">' +
      '  <span class="eyebrow">' + esc(cat(i.category)) + '</span>' +
      ratingHtml +
      '  <h3><a href="' + href + '">' + esc(i.title) + '</a></h3>' +
      '  <p class="muted">' + esc(i.excerpt) + '</p>' +
      '  <div class="price-row"><span class="price">' + money(i.price) + '</span>' + (i.oldPrice ? '<s class="muted">' + money(i.oldPrice) + '</s>' : '') + '</div>' +
      buttonHtml +
      '</div></article>';
  }

  /* ========================================================================
     5. Vitrine / Home
     ======================================================================== */
  function home() {
    var h = C.hero || {};
    var heroEl = $("#hero");
    if (heroEl) {
      heroEl.innerHTML = '<div class="hero-copy"><span class="eyebrow">' + esc(h.eyebrow || "") + "</span><h1>" + esc(h.title || db.settings.name) + '</h1><p class="lead">' + esc(db.settings.tagline) + '</p><div class="hero-actions"><a class="btn btn-lg" href="' + (h.ctaHref || "#list") + '">' + esc(h.cta || "Ver produtos") + '</a>' +
        (h.secondary ? '<a class="btn btn-ghost btn-lg" href="' + h.secondaryHref + '">' + esc(h.secondary) + "</a>" : "") +
        "</div>" +
        (h.stats ? '<dl class="stats">' + h.stats.map(function (s) { return "<div><dt>" + esc(s[1]) + "</dt><dd>" + esc(s[0]) + "</dd></div>"; }).join("") + "</dl>" : "") + "</div>" +
        (h.image ? '<div class="hero-media"><img src="' + esc(h.image) + '" alt="" /></div>' : "");
    }

    var listTitleEl = $("#list-title");
    if (listTitleEl) listTitleEl.textContent = C.listTitle || "Produtos em destaque";

    var active = qs.get("cat") || "all";
    var filtersEl = $("#filters");
    if (filtersEl) {
      filtersEl.innerHTML = [{ id: "all", name: "Todos" }].concat(db.categories || []).map(function (c) {
        return '<button role="tab" class="pill' + (c.id === active ? " is-active" : "") + '" data-cat="' + esc(c.id) + '">' + esc(c.name) + "</button>";
      }).join("");
    }

    var sortEl = $("#sort");
    if (sortEl) {
      sortEl.innerHTML = (C.sorts || [["recent", "Mais recentes"]]).map(function (s) {
        return '<option value="' + s[0] + '">' + esc(s[1]) + "</option>";
      }).join("");
    }

    function render() {
      var searchInput = $("#search");
      var q = searchInput ? searchInput.value.toLowerCase().trim() : "";
      var s = sortEl ? sortEl.value : "recent";

      var list = DB.published().filter(function (i) {
        var matchCat = (active === "all" || i.category === active);
        var matchSearch = !q || (i.title + " " + (i.excerpt || "") + " " + (i.body || "")).toLowerCase().indexOf(q) >= 0;
        return matchCat && matchSearch;
      });

      list.sort(function (a, b) {
        if (s === "price-asc") return (a.price || 0) - (b.price || 0);
        if (s === "price-desc") return (b.price || 0) - (a.price || 0);
        if (s === "popular") return (b.views || b.sold || 0) - (a.views || a.sold || 0);
        return new Date(b.date || 0) - new Date(a.date || 0);
      });

      var listEl = $("#list");
      if (listEl) {
        listEl.className = "grid";
        listEl.innerHTML = list.map(card).join("");
      }

      var emptyEl = $("#empty");
      if (emptyEl) emptyEl.hidden = list.length > 0;
    }

    if (filtersEl) {
      filtersEl.addEventListener("click", function (e) {
        var b = e.target.closest("[data-cat]");
        if (!b) return;
        active = b.dataset.cat;
        document.querySelectorAll(".pill").forEach(function (p) {
          p.classList.toggle("is-active", p === b);
        });
        render();
      });
    }

    var searchEl = $("#search");
    if (searchEl) searchEl.addEventListener("input", render);
    if (sortEl) sortEl.addEventListener("change", render);

    render();

    var extraEl = $("#extra");
    if (extraEl && C.extra) extraEl.innerHTML = C.extra;
  }

  /* ========================================================================
     6. Detalhes do Produto (`item.html`)
     ======================================================================== */
  function detail() {
    var i = DB.item(qs.get("id") || "");
    var el = $("#detail");
    if (!el) return;
    if (!i || i.status === "rascunho") {
      el.innerHTML = '<div class="empty"><h1>Produto não encontrado</h1><a class="btn" href="index.html">Voltar para a vitrine</a></div>';
      return;
    }
    document.title = i.title + " — " + db.settings.name;
    i.views = (i.views || 0) + 1;
    DB.save();

    var crumbs = '<nav class="crumbs"><a href="index.html">Início</a> / <a href="index.html?cat=' + esc(i.category) + '">' + esc(cat(i.category)) + "</a> / " + esc(i.title) + "</nav>";
    var body = (i.body || i.excerpt || "").split(/\n\n+/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var inStock = i.stock === undefined || i.stock > 0;

    el.innerHTML = crumbs +
      '<div class="product">' +
      '  <div><img class="product-img" src="' + esc(i.image) + '" alt="' + esc(i.title) + '" /></div>' +
      '  <div>' +
      '    <span class="eyebrow">' + esc(cat(i.category)) + '</span>' +
      '    <h1>' + esc(i.title) + '</h1>' +
      (i.rating ? '<div class="rating-row" style="margin-bottom:1rem;"><span class="rating-stars">★★★★★</span><strong>' + Number(i.rating).toFixed(1) + '</strong><span class="muted">(' + (i.reviews || 0) + ' avaliações verificadas)</span></div>' : '') +
      '    <div class="price-row big"><span class="price">' + money(i.price) + '</span>' + (i.oldPrice ? '<s>' + money(i.oldPrice) + '</s>' : '') + '</div>' +
      '    <p class="muted">Em até <strong>10x de ' + money(i.price / 10) + '</strong> sem juros no cartão ou com <strong>5% OFF no PIX</strong>.</p>' +
      '    <div class="prose" style="margin:1.5rem 0;">' + body + '</div>' +
      '    <p class="' + (inStock ? "ok" : "danger") + '">' + (inStock ? (i.stock !== undefined ? '✓ Em estoque (' + i.stock + ' unidades)' : '✓ Em estoque para envio imediato') : '✕ Produto esgotado') + '</p>' +
      (inStock ?
        '<div class="detail-actions">' +
        '  <div class="qty-selector">' +
        '    <button id="qty-minus" aria-label="Diminuir quantidade">−</button>' +
        '    <span id="qty-val">1</span>' +
        '    <button id="qty-plus" aria-label="Aumentar quantidade">+</button>' +
        '  </div>' +
        '  <button class="btn btn-lg" id="btn-add-detail" style="flex:1;">' + ICONS.bag + ' Adicionar à Sacola</button>' +
        '  <button class="btn btn-secondary btn-lg" id="btn-buy-now">Comprar Agora</button>' +
        '</div>' : '') +
      '    <div class="shipping-calc">' +
      '      <div class="shipping-calc-head">' + ICONS.truck + ' <span>Calcular prazo e frete para seu CEP</span></div>' +
      '      <form class="shipping-calc-form" id="detail-cep-form">' +
      '        <input class="input" name="cep" id="detail-cep-input" placeholder="00000-000" maxlength="9" required />' +
      '        <button class="btn btn-ghost" type="submit">Calcular</button>' +
      '      </form>' +
      '      <div class="shipping-results" id="detail-shipping-results" hidden></div>' +
      '    </div>' +
      '    <ul class="perks">' +
      '      <li>' + ICONS.shield + ' Garantia de 30 dias com devolução sem complicações.</li>' +
      '      <li>' + ICONS.truck + ' Frete grátis para compras acima de R$ ' + (db.settings.freeShippingFrom || 299) + '.</li>' +
      '      <li>' + ICONS.check + ' Pagamento 100% criptografado e seguro.</li>' +
      '    </ul>' +
      '  </div>' +
      '</div>';

    // Controle de quantidade no detalhe
    var qtyValEl = $("#qty-val");
    state.itemDetailQty = 1;

    var minusBtn = $("#qty-minus"), plusBtn = $("#qty-plus");
    if (minusBtn && plusBtn && qtyValEl) {
      minusBtn.addEventListener("click", function () {
        if (state.itemDetailQty > 1) {
          state.itemDetailQty--;
          qtyValEl.textContent = state.itemDetailQty;
        }
      });
      plusBtn.addEventListener("click", function () {
        if (i.stock !== undefined && state.itemDetailQty >= i.stock) {
          toast("Estoque máximo: " + i.stock + " un.");
          return;
        }
        state.itemDetailQty++;
        qtyValEl.textContent = state.itemDetailQty;
      });
    }

    var addBtn = $("#btn-add-detail");
    if (addBtn) {
      addBtn.addEventListener("click", function () {
        addToCart(i.id, state.itemDetailQty);
        openDrawer();
      });
    }

    var buyNowBtn = $("#btn-buy-now");
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", function () {
        addToCart(i.id, state.itemDetailQty, true);
        location.href = "cart.html";
      });
    }

    // Simulador de Frete na página do produto
    var cepForm = $("#detail-cep-form");
    if (cepForm) {
      cepForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var cep = $("#detail-cep-input").value;
        var options = DB.calcShipping(cep, i.price * state.itemDetailQty);
        var resBox = $("#detail-shipping-results");
        if (!options) {
          toast("Informe um CEP válido com 8 dígitos");
          return;
        }
        resBox.hidden = false;
        resBox.innerHTML = options.map(function (opt) {
          return '<div class="shipping-option"><div><strong>' + esc(opt.name) + '</strong><div class="muted small">' + esc(opt.deadline) + '</div></div><div>' + (opt.price === 0 ? '<strong class="ok">Grátis</strong>' : '<strong>' + money(opt.price) + '</strong>') + '</div></div>';
        }).join("");
      });
    }
  }

  /* ========================================================================
     7. Carrinho & Checkout Completo (`cart.html`)
     ======================================================================== */
  function cart() {
    var el = $("#cart");
    if (!el) return;

    function draw() {
      var lines = (db.cart || []).map(function (l) {
        return { l: l, i: DB.item(l.id) };
      }).filter(function (x) { return x.i; });

      var subtotal = lines.reduce(function (s, x) { return s + (x.i.price || 0) * x.l.qty; }, 0);

      if (!lines.length) {
        el.innerHTML = '<div class="empty"><h1>Sua sacola está vazia</h1><p class="muted">Aproveite os melhores produtos e ofertas exclusivas na nossa vitrine!</p><a class="btn btn-lg" href="index.html">Explorar Produtos</a></div>';
        return;
      }

      // Cálculo de cupom
      var couponDiscount = 0;
      var hasFreeShippingCoupon = false;
      if (db.appliedCoupon) {
        if (db.appliedCoupon.type === "percent") {
          couponDiscount = subtotal * (db.appliedCoupon.discount / 100);
        } else if (db.appliedCoupon.type === "shipping") {
          hasFreeShippingCoupon = true;
        }
      }

      // Frete padrão ou selecionado
      var shippingCost = 0;
      var threshold = Number(db.settings.freeShippingFrom) || 299;
      if (hasFreeShippingCoupon || subtotal >= threshold) {
        shippingCost = 0;
      } else if (state.selectedShipping) {
        shippingCost = state.selectedShipping.price;
      } else {
        shippingCost = 22.90;
      }

      // Desconto PIX extra de 5%
      var pixDiscount = 0;
      var baseTotal = Math.max(0, subtotal - couponDiscount + shippingCost);
      if (state.paymentMethod === "pix") {
        pixDiscount = baseTotal * 0.05;
      }

      var finalTotal = Math.max(0, baseTotal - pixDiscount);

      el.innerHTML =
        '<div class="section-head"><h1>Finalizar Pedido</h1><a class="link" href="index.html">← Continuar Comprando</a></div>' +
        '<div class="cart-grid">' +
        '  <div>' +
        '    <div class="cart-items-card">' +
        lines.map(function (x) {
          return '<div class="cart-line">' +
            '<img src="' + esc(x.i.image) + '" alt="' + esc(x.i.title) + '" />' +
            '<div>' +
            '  <strong><a href="item.html?id=' + encodeURIComponent(x.i.id) + '">' + esc(x.i.title) + '</a></strong>' +
            '  <div class="muted small">' + money(x.i.price) + ' cada</div>' +
            '  <button class="link danger small" style="margin-top:.4rem;display:inline-flex;align-items:center;gap:.3rem;" data-del="' + esc(x.i.id) + '">' + ICONS.trash + ' Remover</button>' +
            '</div>' +
            '<div class="qty">' +
            '  <button data-q="-1" data-id="' + esc(x.i.id) + '" aria-label="Diminuir">−</button>' +
            '  <span>' + x.l.qty + '</span>' +
            '  <button data-q="1" data-id="' + esc(x.i.id) + '" aria-label="Aumentar">+</button>' +
            '</div>' +
            '<div class="right"><strong>' + money(x.i.price * x.l.qty) + '</strong></div>' +
            '</div>';
        }).join("") +
        '    </div>' +
        '  </div>' +
        '  <aside class="summary">' +
        '    <h3>Resumo do Pedido</h3>' +
        '    <div class="row"><span>Subtotal</span><span>' + money(subtotal) + '</span></div>' +
        (couponDiscount > 0 ? '<div class="row discount"><span>Cupom (' + esc(db.appliedCoupon.code) + ')</span><span>− ' + money(couponDiscount) + '</span></div>' : '') +
        '    <div class="row"><span>Frete</span><span>' + (shippingCost === 0 ? '<strong class="ok">Grátis</strong>' : money(shippingCost)) + '</span></div>' +
        (pixDiscount > 0 ? '<div class="row discount"><span>Desconto PIX (5% OFF)</span><span>− ' + money(pixDiscount) + '</span></div>' : '') +
        '    <div class="row total"><span>Total a pagar</span><strong>' + money(finalTotal) + '</strong></div>' +
        '    <div class="coupon-box">' +
        (db.appliedCoupon ?
          '<div class="coupon-active"><span>✓ Cupom <b>' + esc(db.appliedCoupon.code) + '</b> (' + esc(db.appliedCoupon.desc) + ')</span><button class="link danger small" id="btn-remove-coupon">Remover</button></div>' :
          '<form class="coupon-form" id="coupon-form"><input class="input" name="code" placeholder="Possui cupom? (ex: BEMVINDO10)" required /><button class="btn btn-ghost" type="submit">Aplicar</button></form>') +
        '    </div>' +
        '    <form class="form" id="checkout-form">' +
        '      <label class="eyebrow" style="margin-top:.75rem;">1. Seus Dados de Entrega</label>' +
        '      <input class="input" name="name" required placeholder="Nome completo" />' +
        '      <div style="display:grid;grid-template-columns:1fr 1fr;gap:.6rem;">' +
        '        <input class="input" name="email" type="email" required placeholder="Seu e-mail" />' +
        '        <input class="input" name="phone" type="tel" required placeholder="WhatsApp / Telefone" />' +
        '      </div>' +
        '      <input class="input" name="cep" id="checkout-cep" required placeholder="CEP (ex: 01001-000)" maxlength="9" />' +
        '      <input class="input" name="address" required placeholder="Endereço, número e complemento" />' +
        '      <label class="eyebrow" style="margin-top:1.25rem;">2. Forma de Pagamento</label>' +
        '      <div class="payment-methods">' +
        '        <label class="payment-option' + (state.paymentMethod === "pix" ? " is-selected" : "") + '"><input type="radio" name="payment" value="pix"' + (state.paymentMethod === "pix" ? " checked" : "") + ' /> <strong>PIX Imediato</strong> <span class="payment-badge">5% OFF</span></label>' +
        '        <label class="payment-option' + (state.paymentMethod === "card" ? " is-selected" : "") + '"><input type="radio" name="payment" value="card"' + (state.paymentMethod === "card" ? " checked" : "") + ' /> <strong>Cartão de Crédito</strong> <span class="muted small" style="margin-left:auto;">até 10x sem juros</span></label>' +
        '        <label class="payment-option' + (state.paymentMethod === "boleto" ? " is-selected" : "") + '"><input type="radio" name="payment" value="boleto"' + (state.paymentMethod === "boleto" ? " checked" : "") + ' /> <strong>Boleto Bancário</strong></label>' +
        '      </div>' +
        '      <button class="btn btn-block btn-lg" type="submit" style="margin-top:1.25rem;">Confirmar e Finalizar Pedido</button>' +
        '      <p class="muted small center" style="margin-top:.75rem;">🔒 Pagamento 100% seguro com garantia de entrega.</p>' +
        '    </form>' +
        '  </aside>' +
        '</div>';
    }

    // Delegação de cliques no carrinho
    el.addEventListener("click", function (e) {
      var delBtn = e.target.closest("[data-del]");
      if (delBtn) {
        var idToDel = delBtn.dataset.del;
        db.cart = db.cart.filter(function (x) { return String(x.id) !== String(idToDel); });
        DB.save();
        updateCartBadge();
        draw();
        toast("Produto removido do carrinho");
        return;
      }

      var qBtn = e.target.closest("[data-q]");
      if (qBtn) {
        var id = qBtn.dataset.id;
        var delta = Number(qBtn.dataset.q);
        var l = db.cart.find(function (x) { return String(x.id) === String(id); });
        if (!l) return;
        var item = DB.item(l.id);

        if (delta > 0 && item && item.stock !== undefined && l.qty >= item.stock) {
          toast("Estoque máximo: " + item.stock + " un.");
          return;
        }

        l.qty += delta;
        if (l.qty <= 0) {
          db.cart = db.cart.filter(function (x) { return String(x.id) !== String(id); });
        }
        DB.save();
        updateCartBadge();
        draw();
        return;
      }

      var remCouponBtn = e.target.closest("#btn-remove-coupon");
      if (remCouponBtn) {
        DB.removeCoupon();
        toast("Cupom removido");
        draw();
        return;
      }
    });

    // Mudança de forma de pagamento
    el.addEventListener("change", function (e) {
      if (e.target.name === "payment") {
        state.paymentMethod = e.target.value;
        draw();
      }
    });

    // Submissão de Cupom
    el.addEventListener("submit", function (e) {
      if (e.target.matches("#coupon-form")) {
        e.preventDefault();
        var code = e.target.querySelector("input[name=code]").value;
        var res = DB.applyCoupon(code);
        toast(res.message);
        if (res.ok) draw();
        return;
      }

      // Finalização do Pedido
      if (e.target.matches("#checkout-form")) {
        e.preventDefault();
        var d = new FormData(e.target);

        var lines = db.cart.map(function (l) {
          return { l: l, i: DB.item(l.id) };
        }).filter(function (x) { return x.i; });

        var subtotal = lines.reduce(function (s, x) { return s + (x.i.price || 0) * x.l.qty; }, 0);
        var couponDiscount = 0;
        var hasFreeShippingCoupon = false;
        if (db.appliedCoupon) {
          if (db.appliedCoupon.type === "percent") couponDiscount = subtotal * (db.appliedCoupon.discount / 100);
          else if (db.appliedCoupon.type === "shipping") hasFreeShippingCoupon = true;
        }

        var threshold = Number(db.settings.freeShippingFrom) || 299;
        var shippingCost = (hasFreeShippingCoupon || subtotal >= threshold) ? 0 : 22.90;
        var baseTotal = Math.max(0, subtotal - couponDiscount + shippingCost);
        var pixDiscount = state.paymentMethod === "pix" ? baseTotal * 0.05 : 0;
        var finalTotal = Math.max(0, baseTotal - pixDiscount);

        var orderId = "PED-" + (1000 + db.orders.length + 1);
        var orderSnapshot = {
          id: orderId,
          customer: String(d.get("name")).trim(),
          email: String(d.get("email")).trim(),
          phone: String(d.get("phone")).trim(),
          cep: String(d.get("cep")).trim(),
          address: String(d.get("address")).trim(),
          paymentMethod: state.paymentMethod,
          items: lines.map(function (x) {
            return {
              id: x.i.id,
              title: x.i.title,
              price: x.i.price,
              qty: x.l.qty,
              image: x.i.image
            };
          }),
          subtotal: subtotal,
          discount: couponDiscount + pixDiscount,
          shipping: shippingCost,
          total: finalTotal,
          status: "novo",
          date: new Date().toISOString()
        };

        db.orders.unshift(orderSnapshot);

        // Baixa no estoque
        db.cart.forEach(function (l) {
          var it = DB.item(l.id);
          if (it) {
            if (it.stock !== undefined) it.stock = Math.max(0, it.stock - l.qty);
            it.sold = (it.sold || 0) + l.qty;
          }
        });

        db.cart = [];
        DB.save();
        updateCartBadge();

        // Preparação do resumo para WhatsApp
        var whatsappMsg = encodeURIComponent(
          "Olá! Acabei de realizar o pedido " + orderSnapshot.id + " na " + db.settings.name + ".\n" +
          "Nome: " + orderSnapshot.customer + "\n" +
          "Total: " + money(finalTotal) + " (" + state.paymentMethod.toUpperCase() + ")\n" +
          "Itens: " + orderSnapshot.items.map(function (it) { return it.title + " (" + it.qty + "x)"; }).join(", ")
        );
        var whatsappUrl = "https://wa.me/" + (db.settings.phone || "5511999998888") + "?text=" + whatsappMsg;

        // Renderização da tela de sucesso moderno
        var paymentDetailsHtml = "";
        if (state.paymentMethod === "pix") {
          var fakePixCode = "00020126580014BR.GOV.BCB.PIX0136" + (db.settings.pixKey || "contato@lojavirtual.com.br") + "52040000530398654" + finalTotal.toFixed(2) + "5802BR5913" + db.settings.name + "6009SAO PAULO";
          paymentDetailsHtml =
            '<div class="payment-details-box">' +
            '  <h4>Pagamento via PIX Copia e Cola</h4>' +
            '  <p class="muted small">Copie o código abaixo e cole no aplicativo do seu banco para pagar:</p>' +
            '  <div class="pix-code-box">' +
            '    <input class="input" readonly value="' + esc(fakePixCode) + '" id="pix-copy-input" />' +
            '    <button class="btn btn-ghost" type="button" id="btn-copy-pix">Copiar</button>' +
            '  </div>' +
            '</div>';
        }

        el.innerHTML =
          '<div class="order-success">' +
          '  <div class="order-success-icon">✓</div>' +
          '  <h1>Pedido Confirmado com Sucesso!</h1>' +
          '  <p class="lead">Obrigado pela compra, <strong>' + esc(orderSnapshot.customer) + '</strong>.</p>' +
          '  <p class="muted">Número do pedido: <strong>' + esc(orderSnapshot.id) + '</strong> · Total: <strong>' + money(finalTotal) + '</strong></p>' +
          paymentDetailsHtml +
          '  <div style="display:flex;gap:1rem;justify-content:center;margin-top:2rem;flex-wrap:wrap;">' +
          '    <a class="btn btn-whatsapp btn-lg" href="' + whatsappUrl + '" target="_blank" rel="noopener">' + ICONS.whatsapp + ' Enviar comprovante no WhatsApp</a>' +
          '    <a class="btn btn-ghost btn-lg" href="index.html">Voltar para a Vitrine</a>' +
          '  </div>' +
          '</div>';

        var copyBtn = $("#btn-copy-pix");
        if (copyBtn) {
          copyBtn.addEventListener("click", function () {
            var copyInput = $("#pix-copy-input");
            if (copyInput) {
              copyInput.select();
              navigator.clipboard.writeText(copyInput.value);
              toast("Código PIX copiado com sucesso!");
            }
          });
        }
      }
    });

    draw();
  }

  /* ========================================================================
     8. Adicionar ao Carrinho Global
     ======================================================================== */
  function addToCart(id, qty, silent) {
    var quantity = qty || 1;
    var item = DB.item(id);
    if (!item) {
      toast("Produto não encontrado");
      return;
    }
    if (item.stock !== undefined && item.stock <= 0) {
      toast("Este produto está esgotado");
      return;
    }

    var l = db.cart.find(function (x) { return String(x.id) === String(id); });
    if (l) {
      if (item.stock !== undefined && (l.qty + quantity) > item.stock) {
        toast("Limite de estoque atingido (" + item.stock + " un.)");
        return;
      }
      l.qty += quantity;
    } else {
      db.cart.push({ id: id, qty: quantity });
    }

    DB.save();
    updateCartBadge();
    if (!silent) {
      toast("Produto adicionado à sua sacola!");
    }
  }

  /* ========================================================================
     9. Páginas Auxiliares (Busca e Conteúdo)
     ======================================================================== */
  function searchPage() {
    var input = $("#global-search"), host = $("#search-results"), empty = $("#search-empty");
    if (!input || !host) return;
    var initialQ = qs.get("q") || "";
    if (initialQ) input.value = initialQ;

    function draw() {
      var q = input.value.trim().toLocaleLowerCase("pt-BR");
      var list = DB.published().filter(function (i) {
        return !q || (i.title + " " + (i.excerpt || "") + " " + (i.body || "")).toLocaleLowerCase("pt-BR").includes(q);
      });
      host.innerHTML = list.map(card).join("");
      if (empty) empty.hidden = list.length > 0;
    }

    input.addEventListener("input", draw);
    draw();
  }

  function contentPage() {
    var slug = qs.get("slug") || "about", data = C.pagesContent && C.pagesContent[slug], el = $("#content-page");
    if (!el) return;
    if (!data) {
      el.innerHTML = '<div class="empty"><h1>Página não encontrada</h1><a class="btn" href="index.html">Voltar ao início</a></div>';
      return;
    }
    document.title = data.title + " — " + db.settings.name;
    el.innerHTML = '<nav class="crumbs"><a href="index.html">Início</a> / ' + esc(data.title) + '</nav><span class="eyebrow">' + esc(db.settings.name) + '</span><h1>' + esc(data.title) + '</h1><div class="prose lead">' + esc(data.body).split(/\n\n+/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("") + '</div>';
  }

  function newsletter() {
    document.addEventListener("submit", function (e) {
      if (!e.target.matches("[data-newsletter]")) return;
      e.preventDefault();
      var email = String(new FormData(e.target).get("email") || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast("Informe um e-mail válido");
        return;
      }
      db.messages.unshift({ id: DB.uid(), email: email, type: "newsletter", date: new Date().toISOString() });
      DB.save();
      e.target.reset();
      toast("Inscrição confirmada! Cupom BEMVINDO10 liberado.");
    });
  }

  window.toast = function (msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = ICONS.check + " <span>" + esc(msg) + "</span>";
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2800);
  };

  /* ========================================================================
     Inicialização
     ======================================================================== */
  try {
    header();
    setupDrawer();
    footer();
    newsletter();

    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]");
      if (b) {
        addToCart(b.dataset.add);
        openDrawer();
      }
    });

    if (page === "home") home();
    else if (page === "item") detail();
    else if (page === "cart") cart();
    else if (page === "content") contentPage();
    else if (page === "search") searchPage();
  } catch (err) {
    console.error("Falha ao inicializar o site:", err);
  }
})();

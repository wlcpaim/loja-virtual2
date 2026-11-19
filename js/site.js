/* Site público: cabeçalho, listagem, detalhe, comentários e carrinho. */
(function () {
  var C = window.SITE || {}, db = DB.get(), page = document.body.dataset.page;
  var $ = function (s) { return document.querySelector(s); };
  var qs = new URLSearchParams(location.search);

  function header() {
    var cartCount = C.kind === "store" ? (db.cart || []).reduce(function (n, l) { return n + (l.qty || 0); }, 0) : 0;
    var links = (C.nav || []).map(function (n) { return '<a href="' + n.href + '">' + esc(n.label) + "</a>"; }).join("");
    var headerEl = $("#site-header");
    if (!headerEl) return;
    
    headerEl.innerHTML =
      (C.topbar ? '<div class="topbar">' + esc(C.topbar) + "</div>" : "") +
      '<header class="site-header"><div class="container header-inner">' +
      '<a class="brand" href="index.html"><span class="brand-mark">' + esc(db.settings.name.charAt(0)) + "</span>" + esc(db.settings.name) + "</a>" +
      '<button class="menu-toggle" aria-expanded="false" aria-controls="menu" aria-label="Abrir menu"><span></span><span></span><span></span></button>' +
      '<nav id="menu" class="nav" aria-label="Principal">' + links +
      (C.kind === "store" ? '<a class="cart-link" href="cart.html">Carrinho <span class="badge">' + cartCount + "</span></a>" : "") +
      '<a href="search.html" aria-label="Buscar">Buscar</a><a class="nav-admin" href="admin.html">Admin</a></nav></div></header>';
      
    var t = $(".menu-toggle"), m = $("#menu");
    if (t && m) {
      t.addEventListener("click", function () {
        var o = m.classList.toggle("is-open");
        t.setAttribute("aria-expanded", String(o));
      });
    }
  }

  function footer() {
    var footerEl = $("#site-footer");
    if (!footerEl) return;
    footerEl.innerHTML = '<footer class="site-footer"><div class="container footer-grid"><div><div class="brand">' + esc(db.settings.name) + '</div><p class="muted">' + esc(db.settings.tagline) + "</p></div>" +
      (C.footer || []).map(function (col) {
        return "<div><h4>" + esc(col.title) + "</h4>" + (col.links || []).map(function (l) {
          return '<a href="' + l.href + '">' + esc(l.label) + "</a>";
        }).join("") + "</div>";
      }).join("") +
      '</div><div class="container footer-bottom">© ' + new Date().getFullYear() + " " + esc(db.settings.name) + ". Todos os direitos reservados.</div></footer>";
  }

  function cat(id) {
    var c = (db.categories || []).find(function (x) { return x.id === id; });
    return c ? c.name : "";
  }

  function card(i) {
    var href = "item.html?id=" + encodeURIComponent(i.id);
    if (C.kind === "forum") {
      var n = DB.commentsFor(i.id).length;
      return '<a class="topic-row" href="' + href + '"><span class="avatar">' + esc((i.author || "?").charAt(0)) + '</span><span class="topic-main"><strong>' + (i.pinned ? '<span class="pin">Fixado</span> ' : "") + esc(i.title) + '</strong><span class="muted">' + esc(i.author) + " · " + esc(cat(i.category)) + " · " + fmtDate(i.date) + '</span></span><span class="topic-stat"><b>' + n + "</b> respostas</span><span class=\"topic-stat\"><b>" + (i.views || 0) + "</b> visitas</span></a>";
    }
    var isOutOfStock = i.stock !== undefined && i.stock <= 0;
    var meta = C.kind === "store"
      ? '<div class="price-row"><span class="price">' + money(i.price) + "</span>" + (i.oldPrice ? '<s class="muted">' + money(i.oldPrice) + "</s>" : "") + "</div>"
      : '<div class="muted small">' + esc(i.author || "") + " · " + fmtDate(i.date) + (i.readTime ? " · " + i.readTime + " min" : "") + "</div>";
      
    var buttonHtml = "";
    if (C.kind === "store") {
      if (isOutOfStock) {
        buttonHtml = '<button class="btn btn-block" disabled style="opacity:0.6;cursor:not-allowed">Esgotado</button>';
      } else {
        buttonHtml = '<button class="btn btn-block" data-add="' + esc(i.id) + '">Adicionar ao carrinho</button>';
      }
    }

    return '<article class="card"><a href="' + href + '" class="card-media"><img loading="lazy" src="' + esc(i.image) + '" alt="' + esc(i.title) + '" />' + (i.badge ? '<span class="chip">' + esc(i.badge) + "</span>" : "") + '</a><div class="card-body"><span class="eyebrow">' + esc(cat(i.category)) + '</span><h3><a href="' + href + '">' + esc(i.title) + '</a></h3><p class="muted">' + esc(i.excerpt) + "</p>" + meta + buttonHtml + "</div></article>";
  }

  function home() {
    var h = C.hero || {};
    var heroEl = $("#hero");
    if (heroEl) {
      heroEl.innerHTML = '<div class="hero-copy"><span class="eyebrow">' + esc(h.eyebrow || "") + "</span><h1>" + esc(h.title || db.settings.name) + '</h1><p class="lead">' + esc(db.settings.tagline) + '</p><div class="hero-actions"><a class="btn" href="' + (h.ctaHref || "#list") + '">' + esc(h.cta || "Ver produtos") + '</a>' +
        (h.secondary ? '<a class="btn btn-ghost" href="' + h.secondaryHref + '">' + esc(h.secondary) + "</a>" : "") +
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
        if (C.kind === "forum" && a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        if (s === "price-asc") return (a.price || 0) - (b.price || 0);
        if (s === "price-desc") return (b.price || 0) - (a.price || 0);
        if (s === "popular") return (b.views || b.sold || 0) - (a.views || a.sold || 0);
        return new Date(b.date || 0) - new Date(a.date || 0);
      });

      var listEl = $("#list");
      if (listEl) {
        listEl.className = C.kind === "forum" ? "topic-list" : "grid";
        listEl.innerHTML = list.map(card).join("");
      }

      var emptyEl = $("#empty");
      if (emptyEl) {
        emptyEl.hidden = list.length > 0;
      }
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
    if (extraEl) {
      if (C.extra) extraEl.innerHTML = C.extra;
      else extraEl.remove();
    }
  }

  function contentPage() {
    var slug = qs.get("slug") || "about", data = C.pagesContent && C.pagesContent[slug], el = $("#content-page");
    if (!el) return;
    if (!data) {
      el.innerHTML = '<div class="empty"><h1>Página não encontrada</h1><a class="btn" href="index.html">Voltar ao início</a></div>';
      return;
    }
    document.title = data.title + " — " + db.settings.name;
    el.innerHTML = '<nav class="crumbs"><a href="index.html">Início</a> / ' + esc(data.title) + '</nav><span class="eyebrow">' + esc(db.settings.name) + '</span><h1>' + esc(data.title) + '</h1><p class="lead">' + esc(data.body) + '</p>' + (slug === "contact" ? '<p>Para atendimento, entre em contato através dos nossos canais oficiais.</p>' : '');
  }

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

  function addToCart(id) {
    var item = DB.item(id);
    if (!item) {
      toast("Produto não encontrado");
      return;
    }
    if (item.stock !== undefined && item.stock <= 0) {
      toast("Este produto está esgotado no momento");
      return;
    }
    var l = db.cart.find(function (x) { return String(x.id) === String(id); });
    if (l) {
      if (item.stock !== undefined && l.qty >= item.stock) {
        toast("Limite de estoque atingido (" + item.stock + " un.)");
        return;
      }
      l.qty++;
    } else {
      db.cart.push({ id: id, qty: 1 });
    }
    DB.save();
    header();
    toast("Produto adicionado ao carrinho!");
  }

  function discussion(i) {
    var box = $("#discussion");
    if (!box) return;
    var label = C.kind === "forum" ? "Respostas" : "Comentários";
    function draw() {
      var list = DB.commentsFor(i.id);
      box.innerHTML = "<h2>" + label + " (" + list.length + ")</h2>" + list.map(function (c) {
        return '<div class="comment"><span class="avatar">' + esc(c.author.charAt(0)) + '</span><div><strong>' + esc(c.author) + '</strong> <span class="muted small">' + fmtDate(c.date) + "</span><p>" + esc(c.text) + "</p></div></div>";
      }).join("") +
        (i.locked ? '<p class="notice">Este tópico está fechado para novas respostas.</p>' :
        '<form class="form card-pad" id="cform"><h3>' + (C.kind === "forum" ? "Responder" : "Deixe seu comentário") + '</h3><input class="input" name="author" required maxlength="60" placeholder="Seu nome" /><textarea class="input" name="text" required maxlength="2000" rows="4" placeholder="Escreva aqui..."></textarea><button class="btn">Publicar</button><p class="form-status" role="status"></p></form>');
      var f = $("#cform");
      if (!f) return;
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var d = new FormData(f), a = String(d.get("author")).trim(), t = String(d.get("text")).trim();
        if (a.length < 2 || t.length < 3) {
          f.querySelector(".form-status").textContent = "Preencha nome e mensagem.";
          return;
        }
        db.comments.push({ id: DB.uid(), itemId: i.id, author: a, text: t, date: new Date().toISOString(), status: C.moderate ? "pendente" : "aprovado" });
        DB.save();
        if (C.moderate) toast("Comentário enviado para moderação");
        draw();
      });
    }
    draw();
  }

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

    var crumbs = '<nav class="crumbs"><a href="index.html">Início</a> / <a href="index.html?cat=' + esc(i.category) + '">' + esc(cat(i.category)) + "</a></nav>";
    var body = (i.body || i.excerpt || "").split(/\n\n+/).map(function (p) { return "<p>" + esc(p) + "</p>"; }).join("");
    var inStock = i.stock === undefined || i.stock > 0;

    if (C.kind === "store") {
      el.innerHTML = crumbs + '<div class="product"><img class="product-img" src="' + esc(i.image) + '" alt="' + esc(i.title) + '" /><div><span class="eyebrow">' + esc(cat(i.category)) + "</span><h1>" + esc(i.title) + '</h1><div class="price-row big"><span class="price">' + money(i.price) + "</span>" + (i.oldPrice ? "<s>" + money(i.oldPrice) + "</s>" : "") + '</div><p class="muted">ou 10x de ' + money(i.price / 10) + " sem juros</p>" + body +
        '<p class="' + (inStock ? "ok" : "danger") + '">' + (inStock ? (i.stock !== undefined ? i.stock + " em estoque" : "Em estoque") : "Esgotado") + '</p><button class="btn btn-lg btn-block" data-add="' + esc(i.id) + '"' + (inStock ? "" : " disabled style=\"opacity:0.6;cursor:not-allowed;\"") + '>' + (inStock ? "Adicionar ao carrinho" : "Produto esgotado") + '</button><ul class="perks"><li>Frete grátis para compras acima de R$ 299</li><li>Garantia e troca fácil em 30 dias</li><li>Pagamento protegido com criptografia de ponta a ponta</li></ul></div></div>';
      var discEl = $("#discussion");
      if (discEl) discEl.remove();
    } else if (C.kind === "forum") {
      el.innerHTML = crumbs + '<div class="post-head"><h1>' + esc(i.title) + '</h1><div class="comment op"><span class="avatar">' + esc(i.author.charAt(0)) + '</span><div><strong>' + esc(i.author) + '</strong> <span class="muted small">' + fmtDate(i.date) + "</span>" + body + "</div></div></div>";
      discussion(i);
    } else {
      el.innerHTML = '<div class="narrow">' + crumbs + '<span class="eyebrow">' + esc(cat(i.category)) + "</span><h1 class=\"article-title\">" + esc(i.title) + '</h1><p class="lead">' + esc(i.excerpt) + '</p><div class="byline"><span class="avatar">' + esc((i.author || "?").charAt(0)) + "</span><span><strong>" + esc(i.author) + '</strong><br><span class="muted small">' + fmtDate(i.date) + (i.readTime ? " · " + i.readTime + " min de leitura" : "") + '</span></span></div></div><img class="article-img" src="' + esc(i.image) + '" alt="" /><div class="narrow prose">' + body + '<div class="share">Compartilhar: <a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(i.title) + '" target="_blank" rel="noopener">X</a><a href="https://wa.me/?text=' + encodeURIComponent(i.title + " " + location.href) + '" target="_blank" rel="noopener">WhatsApp</a></div></div>';
      discussion(i);
    }
  }

  function cart() {
    var el = $("#cart");
    if (!el) return;

    function draw() {
      var lines = (db.cart || []).map(function (l) {
        return { l: l, i: DB.item(l.id) };
      }).filter(function (x) { return x.i; });

      var sub = lines.reduce(function (s, x) { return s + (x.i.price || 0) * x.l.qty; }, 0);
      var ship = sub === 0 || sub >= 299 ? 0 : 24.9;
      var total = sub + ship;

      if (!lines.length) {
        el.innerHTML = '<div class="empty"><h1>Seu carrinho está vazio</h1><p class="muted">Explore nossos produtos e aproveite ofertas exclusivas!</p><a class="btn" href="index.html">Ver produtos</a></div>';
        return;
      }

      el.innerHTML = '<h1>Carrinho de Compras</h1><div class="cart-grid"><div>' + lines.map(function (x) {
        return '<div class="cart-line"><img src="' + esc(x.i.image) + '" alt="' + esc(x.i.title) + '" /><div><strong>' + esc(x.i.title) + '</strong><div class="muted">' + money(x.i.price) + ' cada</div><button class="link danger small" style="margin-top:0.4rem;display:inline-block" data-del="' + esc(x.i.id) + '">Remover</button></div><div class="qty"><button data-q="-1" data-id="' + esc(x.i.id) + '" aria-label="Diminuir">−</button><span>' + x.l.qty + '</span><button data-q="1" data-id="' + esc(x.i.id) + '" aria-label="Aumentar">+</button></div><strong>' + money(x.i.price * x.l.qty) + "</strong></div>";
      }).join("") +
        '</div><aside class="summary card-pad"><h3>Resumo da Compra</h3><div class="row"><span>Subtotal</span><span>' + money(sub) + '</span></div><div class="row"><span>Frete</span><span>' + (ship === 0 ? '<strong class="ok">Grátis</strong>' : money(ship)) + '</span></div><div class="row total"><span>Total</span><span>' + money(total) + '</span></div><form class="form" id="checkout"><label class="small muted">Dados para entrega</label><input class="input" name="name" required placeholder="Nome completo" /><input class="input" name="email" type="email" required placeholder="E-mail" /><input class="input" name="cep" required pattern="[0-9]{5}-?[0-9]{3}" placeholder="CEP (ex: 01001-000)" /><button class="btn btn-block btn-lg" type="submit">Concluir Pedido</button><p class="muted small" style="text-align:center;margin-top:0.5rem">Ambiente 100% seguro. Pagamento na entrega ou online.</p></form></aside></div>';
    }

    el.addEventListener("click", function (e) {
      var delBtn = e.target.closest("[data-del]");
      if (delBtn) {
        var idToDel = delBtn.dataset.del;
        db.cart = db.cart.filter(function (x) { return String(x.id) !== String(idToDel); });
        DB.save();
        header();
        draw();
        toast("Item removido do carrinho");
        return;
      }

      var b = e.target.closest("[data-q]");
      if (!b) return;
      var l = db.cart.find(function (x) { return String(x.id) === String(b.dataset.id); });
      if (!l) return;
      var item = DB.item(l.id);
      var delta = Number(b.dataset.q);

      if (delta > 0 && item && item.stock !== undefined && l.qty >= item.stock) {
        toast("Estoque máximo disponível: " + item.stock + " un.");
        return;
      }

      l.qty += delta;
      if (l.qty <= 0) {
        db.cart.splice(db.cart.indexOf(l), 1);
      }
      DB.save();
      header();
      draw();
    });

    el.addEventListener("submit", function (e) {
      if (!e.target.matches("#checkout")) return;
      e.preventDefault();
      var d = new FormData(e.target);

      var lines = db.cart.map(function (l) {
        return { l: l, i: DB.item(l.id) };
      }).filter(function (x) { return x.i; });

      var sub = lines.reduce(function (s, x) { return s + (x.i.price || 0) * x.l.qty; }, 0);
      var ship = sub === 0 || sub >= 299 ? 0 : 24.9;
      var total = sub + ship;

      var orderId = "PED-" + (1000 + db.orders.length + 1);
      var orderSnapshot = {
        id: orderId,
        customer: String(d.get("name")).trim(),
        email: String(d.get("email")).trim(),
        cep: String(d.get("cep")).trim(),
        items: lines.map(function (x) {
          return {
            id: x.i.id,
            title: x.i.title,
            price: x.i.price,
            qty: x.l.qty,
            image: x.i.image
          };
        }),
        subtotal: sub,
        shipping: ship,
        total: total,
        status: "novo",
        date: new Date().toISOString()
      };

      db.orders.unshift(orderSnapshot);

      // Decrementa o estoque
      db.cart.forEach(function (l) {
        var it = DB.item(l.id);
        if (it) {
          if (it.stock !== undefined) it.stock = Math.max(0, it.stock - l.qty);
          it.sold = (it.sold || 0) + l.qty;
        }
      });

      db.cart = [];
      DB.save();
      header();

      el.innerHTML = '<div class="empty"><h1>Pedido Confirmado com Sucesso! 🎉</h1><p class="lead">Obrigado pela preferência, <strong>' + esc(orderSnapshot.customer) + '</strong>.</p><p class="muted">Número do pedido: <strong>' + esc(orderSnapshot.id) + '</strong> · Total: <strong>' + money(total) + '</strong></p><p class="muted small">Enviamos um resumo detalhado para <strong>' + esc(orderSnapshot.email) + '</strong>.</p><div style="margin-top:1.5rem"><a class="btn" href="index.html">Continuar Comprando</a></div></div>';
    });

    draw();
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
      toast("Inscrição confirmada com sucesso!");
    });
  }

  window.toast = function (msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  };

  try {
    header();
    footer();
    newsletter();
    document.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]");
      if (b) addToCart(b.dataset.add);
    });
    if (page === "home") home();
    else if (page === "item") detail();
    else if (page === "cart") cart();
    else if (page === "content") contentPage();
    else if (page === "search") searchPage();
  } catch (err) {
    console.error("Falha ao iniciar o site:", err);
  }
})();

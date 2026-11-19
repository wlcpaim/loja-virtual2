/* Painel administrativo: acesso por senha local, painel, produtos, categorias, pedidos, inscritos e configurações. */
(function () {
  var C = window.SITE || {}, db = DB.get(), root = document.getElementById("admin-root");
  var PASS_KEY = "site:" + (C.id || "loja-virtual2") + ":admin";
  var L = C.labels || { items: "Produtos", item: "Produto" };

  function hash(s) {
    var h = 5381;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    }
    return String(h >>> 0);
  }

  function authed() {
    return sessionStorage.getItem(PASS_KEY + ":ok") === "1";
  }

  function login() {
    var first = !localStorage.getItem(PASS_KEY);
    root.innerHTML = '<div class="login-wrap"><form class="card-pad login" id="login"><a class="brand" href="index.html"><span class="brand-mark">' + esc(db.settings.name.charAt(0)) + "</span>" + esc(db.settings.name) + "</a><h1>" + (first ? "Criar senha do painel" : "Entrar no painel") + '</h1><p class="muted small">' + (first ? "Defina a senha de administrador neste navegador." : "Acesso restrito à administração da loja.") + '</p><input class="input" type="password" name="p" required minlength="6" placeholder="Senha (mín. 6 caracteres)" autocomplete="' + (first ? "new-password" : "current-password") + '" /><button class="btn btn-block">' + (first ? "Criar senha e entrar" : "Entrar no painel") + '</button><p class="form-status" role="status"></p></form></div>';

    document.getElementById("login").addEventListener("submit", function (e) {
      e.preventDefault();
      var p = String(new FormData(e.target).get("p") || "");
      if (p.length < 6) return;
      if (first) {
        localStorage.setItem(PASS_KEY, hash(p));
      } else if (localStorage.getItem(PASS_KEY) !== hash(p)) {
        e.target.querySelector(".form-status").textContent = "Senha incorreta. Tente novamente.";
        return;
      }
      sessionStorage.setItem(PASS_KEY + ":ok", "1");
      shell("dashboard");
    });
  }

  var tabs = [["dashboard", "Painel"], ["items", L.items], ["categories", "Categorias"]];
  if (C.kind === "store") tabs.push(["orders", "Pedidos"]);
  else tabs.push(["comments", C.kind === "forum" ? "Respostas" : "Comentários"]);
  tabs.push(["messages", "Inscritos"], ["settings", "Configurações"]);

  function shell(tab) {
    root.innerHTML = '<div class="admin"><aside class="admin-side"><a class="brand" href="index.html"><span class="brand-mark">' + esc(db.settings.name.charAt(0)) + "</span>" + esc(db.settings.name) + '</a><nav class="admin-nav">' +
      tabs.map(function (t) { return '<button data-tab="' + t[0] + '" class="' + (t[0] === tab ? "is-active" : "") + '">' + esc(t[1]) + "</button>"; }).join("") +
      '</nav><div class="admin-side-foot"><a href="index.html" target="_blank" rel="noopener">Ver loja virtual ↗</a><button id="logout">Sair</button></div></aside><section class="admin-main"><header class="admin-top"><h1>' + esc((tabs.find(function (t) { return t[0] === tab; }) || [null, "Painel"])[1]) + '</h1></header><div id="view"></div></section></div>';

    root.querySelector(".admin-nav").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]");
      if (b) shell(b.dataset.tab);
    });

    document.getElementById("logout").addEventListener("click", function () {
      sessionStorage.removeItem(PASS_KEY + ":ok");
      login();
    });

    var views = {
      dashboard: dashboard,
      items: items,
      categories: categories,
      orders: orders,
      comments: comments,
      messages: messages,
      settings: settings
    };

    if (views[tab]) views[tab](document.getElementById("view"));
  }

  function stat(label, value) {
    return '<div class="stat card-pad"><span class="muted small">' + esc(label) + "</span><strong>" + esc(value) + "</strong></div>";
  }

  function dashboard(v) {
    var pub = db.items.filter(function (i) { return i.status !== "rascunho"; }).length;
    var s = [stat(L.items + " publicados", pub), stat("Rascunhos", db.items.length - pub)];
    if (C.kind === "store") {
      s.push(stat("Total de pedidos", db.orders.length), stat("Faturamento", money(db.orders.reduce(function (a, o) { return a + (o.total || 0); }, 0))));
    } else {
      s.push(stat(C.kind === "forum" ? "Respostas" : "Comentários", db.comments.length), stat("Visualizações", db.items.reduce(function (a, i) { return a + (i.views || 0); }, 0)));
    }
    var top = db.items.slice().sort(function (a, b) {
      return (b.views || b.sold || 0) - (a.views || a.sold || 0);
    }).slice(0, 5);

    v.innerHTML = '<div class="stats-grid">' + s.join("") + '</div><div class="card-pad"><h3>Mais ' + (C.kind === "store" ? "vendidos" : "acessados") + '</h3><table class="table"><tbody>' + top.map(function (i) {
      return "<tr><td>" + esc(i.title) + '</td><td class="right">' + (C.kind === "store" ? (i.sold || 0) + " vendidos" : (i.views || 0) + " visitas") + "</td></tr>";
    }).join("") + "</tbody></table></div>";
  }

  function items(v) {
    function draw() {
      v.innerHTML = '<div class="admin-actions"><input class="input" id="f" placeholder="Filtrar por nome..." /><button class="btn" id="new">+ Novo ' + esc(L.item) + '</button></div><div class="table-wrap"><table class="table"><thead><tr><th>' + esc(L.item) + "</th><th>Categoria</th>" + (C.kind === "store" ? "<th>Preço</th><th>Estoque</th>" : "<th>Autor</th>") + '<th>Status</th><th></th></tr></thead><tbody id="rows"></tbody></table></div>';

      function rows() {
        var filterEl = document.getElementById("f");
        var q = filterEl ? filterEl.value.toLowerCase().trim() : "";
        var tbody = document.getElementById("rows");
        if (!tbody) return;

        tbody.innerHTML = db.items.filter(function (i) {
          return i.title.toLowerCase().indexOf(q) >= 0;
        }).map(function (i) {
          var c = db.categories.find(function (x) { return x.id === i.category; });
          return "<tr><td><strong>" + esc(i.title) + "</strong></td><td>" + esc(c ? c.name : "—") + "</td>" + (C.kind === "store" ? "<td>" + money(i.price) + "</td><td>" + (i.stock || 0) + "</td>" : "<td>" + esc(i.author || "") + "</td>") + '<td><span class="status ' + (i.status === "rascunho" ? "draft" : "live") + '">' + (i.status === "rascunho" ? "Rascunho" : "Publicado") + '</span></td><td class="right"><button class="link" data-edit="' + esc(i.id) + '">Editar</button> <button class="link danger" data-del="' + esc(i.id) + '">Excluir</button></td></tr>';
        }).join("");
      }

      rows();

      var fEl = document.getElementById("f");
      if (fEl) fEl.addEventListener("input", rows);

      var newBtn = document.getElementById("new");
      if (newBtn) newBtn.addEventListener("click", function () { edit(null); });

      var tbody = v.querySelector("tbody");
      if (tbody) {
        tbody.addEventListener("click", function (e) {
          var ed = e.target.closest("[data-edit]"), del = e.target.closest("[data-del]");
          if (ed) edit(DB.item(ed.dataset.edit));
          if (del && confirm("Tem certeza que deseja excluir este item?")) {
            db.items = db.items.filter(function (i) { return String(i.id) !== String(del.dataset.del); });
            DB.save();
            draw();
            toast("Item removido");
          }
        });
      }
    }

    function edit(it) {
      var defaultImg = (C.items && C.items[0] && C.items[0].image) ? C.items[0].image : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";
      var i = it || {
        id: DB.uid(),
        title: "",
        excerpt: "",
        body: "",
        image: defaultImg,
        category: (db.categories[0] || {}).id || "geral",
        author: "Equipe",
        date: new Date().toISOString(),
        status: "publicado",
        price: 0,
        stock: 10
      };

      var catOpts = db.categories.map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (c.id === i.category ? " selected" : "") + ">" + esc(c.name) + "</option>";
      }).join("");

      v.innerHTML = '<form class="card-pad form admin-form" id="ef"><h3>' + (it ? "Editar " + esc(L.item) : "Cadastrar " + esc(L.item)) + '</h3><label>Título<input class="input" name="title" required maxlength="140" value="' + esc(i.title) + '" /></label><label>Resumo curto<textarea class="input" name="excerpt" rows="2" maxlength="300">' + esc(i.excerpt) + '</textarea></label><label>Descrição completa<textarea class="input" name="body" rows="6">' + esc(i.body) + '</textarea></label><div class="form-row"><label>Categoria<select class="input" name="category">' + catOpts + '</select></label><label>Status<select class="input" name="status"><option value="publicado">Publicado</option><option value="rascunho"' + (i.status === "rascunho" ? " selected" : "") + '>Rascunho</option></select></label></div>' +
        (C.kind === "store" ? '<div class="form-row"><label>Preço atual (R$)<input class="input" name="price" type="number" step="0.01" min="0" required value="' + (i.price || 0) + '" /></label><label>Preço anterior (R$)<input class="input" name="oldPrice" type="number" step="0.01" min="0" value="' + (i.oldPrice || "") + '" /></label><label>Estoque<input class="input" name="stock" type="number" min="0" required value="' + (i.stock || 0) + '" /></label></div>' : '<label>Autor<input class="input" name="author" value="' + esc(i.author || "") + '" /></label>') +
        (C.kind === "forum" ? '<div class="form-row"><label class="check"><input type="checkbox" name="pinned"' + (i.pinned ? " checked" : "") + ' /> Fixar no topo</label><label class="check"><input type="checkbox" name="locked"' + (i.locked ? " checked" : "") + " /> Fechar tópico</label></div>" : "") +
        '<label>URL da imagem<input class="input" name="image" type="url" required value="' + esc(i.image) + '" /></label><div class="admin-actions"><button type="button" class="btn btn-ghost" id="cancel">Cancelar</button><button class="btn">Salvar Alterações</button></div></form>';

      document.getElementById("cancel").addEventListener("click", draw);
      document.getElementById("ef").addEventListener("submit", function (e) {
        e.preventDefault();
        var d = new FormData(e.target);
        ["title", "excerpt", "body", "category", "status", "image", "author"].forEach(function (k) {
          if (d.has(k)) i[k] = String(d.get(k)).trim();
        });
        if (C.kind === "store") {
          i.price = Number(d.get("price")) || 0;
          i.oldPrice = d.get("oldPrice") ? Number(d.get("oldPrice")) : undefined;
          i.stock = Math.max(0, parseInt(d.get("stock"), 10) || 0);
        }
        if (C.kind === "forum") {
          i.pinned = d.has("pinned");
          i.locked = d.has("locked");
        }
        if (!it) {
          db.items.unshift(i);
        }
        DB.save();
        toast("Produto salvo com sucesso!");
        draw();
      });
    }

    draw();
  }

  function categories(v) {
    function draw() {
      v.innerHTML = '<form class="admin-actions" id="cf"><input class="input" name="n" required maxlength="40" placeholder="Nome da nova categoria" /><button class="btn">Adicionar</button></form><div class="table-wrap"><table class="table"><thead><tr><th>Categoria</th><th>Itens vinculados</th><th>Ação</th></tr></thead><tbody>' + db.categories.map(function (c) {
        var n = db.items.filter(function (i) { return i.category === c.id; }).length;
        return "<tr><td><strong>" + esc(c.name) + "</strong></td><td class=\"muted\">" + n + ' itens</td><td class="right"><button class="link danger" data-del="' + esc(c.id) + '"' + (n ? " disabled title=\"Mova ou exclua os produtos antes de remover a categoria\"" : "") + ">Excluir</button></td></tr>";
      }).join("") + "</tbody></table></div>";

      document.getElementById("cf").addEventListener("submit", function (e) {
        e.preventDefault();
        var n = String(new FormData(e.target).get("n") || "").trim();
        if (!n) return;
        var slug = n.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        if (!slug) slug = "cat-" + Date.now().toString(36);
        if (db.categories.some(function (c) { return c.id === slug; })) {
          toast("Essa categoria já existe");
          return;
        }
        db.categories.push({ id: slug, name: n });
        DB.save();
        draw();
        toast("Categoria adicionada!");
      });

      v.querySelector("tbody").addEventListener("click", function (e) {
        var b = e.target.closest("[data-del]");
        if (b && !b.disabled) {
          db.categories = db.categories.filter(function (c) { return c.id !== b.dataset.del; });
          DB.save();
          draw();
          toast("Categoria excluída");
        }
      });
    }
    draw();
  }

  function orders(v) {
    var st = ["novo", "pago", "enviado", "entregue", "cancelado"];

    function draw() {
      if (!db.orders || !db.orders.length) {
        v.innerHTML = '<div class="empty card-pad"><h3>Nenhum pedido realizado ainda</h3><p class="muted">Os pedidos finalizados no carrinho aparecerão listados aqui em tempo real.</p></div>';
        return;
      }

      v.innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Itens</th><th>Total</th><th>Status</th></tr></thead><tbody>' + db.orders.map(function (o) {
        var itemsSummary = Array.isArray(o.items)
          ? o.items.map(function (it) { return esc(it.title || ("Item " + it.id)) + " (" + (it.qty || 1) + "x)"; }).join(", ")
          : "—";

        return "<tr><td><strong>" + esc(o.id) + "</strong></td><td>" + esc(o.customer) + '<br><span class="muted small">' + esc(o.email) + (o.cep ? " · CEP: " + esc(o.cep) : "") + "</span></td><td>" + fmtDate(o.date) + '</td><td style="max-width:240px;font-size:0.85rem;" class="muted">' + itemsSummary + "</td><td><strong>" + money(o.total) + '</strong></td><td><select class="input" data-order-id="' + esc(o.id) + '">' + st.map(function (s) {
          return '<option value="' + s + '"' + (s === o.status ? " selected" : "") + ">" + s.toUpperCase() + "</option>";
        }).join("") + "</select></td></tr>";
      }).join("") + "</tbody></table></div>";

      var selects = v.querySelectorAll("select[data-order-id]");
      selects.forEach(function (sel) {
        sel.addEventListener("change", function () {
          var orderId = sel.dataset.orderId;
          var order = db.orders.find(function (o) { return o.id === orderId; });
          if (order) {
            order.status = sel.value;
            DB.save();
            toast("Status do pedido " + orderId + " atualizado para " + sel.value.toUpperCase());
          }
        });
      });
    }

    draw();
  }

  function comments(v) {
    function draw() {
      if (!db.comments || !db.comments.length) {
        v.innerHTML = '<p class="empty card-pad">Nenhuma mensagem registrada.</p>';
        return;
      }

      v.innerHTML = '<div class="table-wrap"><table class="table"><thead><tr><th>Autor</th><th>Mensagem</th><th>Em</th><th>Status</th><th>Ações</th></tr></thead><tbody>' + db.comments.slice().reverse().map(function (c) {
        var it = DB.item(c.itemId);
        return "<tr><td>" + esc(c.author) + "</td><td>" + esc(c.text.slice(0, 120)) + '</td><td class="muted">' + esc(it ? it.title : "—") + '</td><td><span class="status ' + (c.status === "aprovado" ? "live" : "draft") + '">' + esc(c.status) + '</span></td><td class="right"><button class="link" data-ap="' + esc(c.id) + '">' + (c.status === "aprovado" ? "Ocultar" : "Aprovar") + '</button> <button class="link danger" data-del="' + esc(c.id) + '">Excluir</button></td></tr>';
      }).join("") + "</tbody></table></div>";

      v.querySelector("tbody").addEventListener("click", function (e) {
        var a = e.target.closest("[data-ap]"), d = e.target.closest("[data-del]");
        if (a) {
          var c = db.comments.find(function (x) { return x.id === a.dataset.ap; });
          if (c) c.status = c.status === "aprovado" ? "oculto" : "aprovado";
        }
        if (d) {
          db.comments = db.comments.filter(function (x) { return x.id !== d.dataset.del; });
        }
        if (a || d) {
          DB.save();
          draw();
        }
      });
    }
    draw();
  }

  function messages(v) {
    if (!db.messages || !db.messages.length) {
      v.innerHTML = '<div class="empty card-pad"><h3>Nenhum inscrito ainda</h3><p class="muted">Os e-mails inscritos na newsletter do rodapé serão listados aqui.</p></div>';
      return;
    }

    v.innerHTML = '<div class="admin-actions"><button class="btn btn-ghost" id="csv">Exportar Inscritos (CSV)</button></div><div class="table-wrap"><table class="table"><thead><tr><th>E-mail</th><th>Data de Inscrição</th></tr></thead><tbody>' + db.messages.map(function (m) {
      return "<tr><td>" + esc(m.email) + "</td><td>" + fmtDate(m.date) + "</td></tr>";
    }).join("") + "</tbody></table></div>";

    var b = document.getElementById("csv");
    if (b) {
      b.addEventListener("click", function () {
        var csv = "email,data\n" + db.messages.map(function (m) { return m.email + "," + m.date; }).join("\n");
        var a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        a.download = "inscritos-newsletter.csv";
        a.click();
      });
    }
  }

  function settings(v) {
    v.innerHTML = '<form class="card-pad form admin-form" id="sf"><h3>Configurações Gerais</h3><label>Nome da loja<input class="input" name="name" required maxlength="60" value="' + esc(db.settings.name) + '" /></label><label>Slogan / Subtítulo<input class="input" name="tagline" maxlength="160" value="' + esc(db.settings.tagline) + '" /></label><div class="admin-actions"><button class="btn">Salvar Configurações</button></div></form><div class="card-pad danger-zone"><h3>Restaurar dados originais</h3><p class="muted small">Restaura os produtos, categorias e configurações para os dados padrão de demonstração.</p><button class="btn btn-danger" id="reset">Restaurar Catálogo Padrão</button></div>';

    document.getElementById("sf").addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(e.target);
      db.settings.name = String(d.get("name")).trim();
      db.settings.tagline = String(d.get("tagline")).trim();
      DB.save();
      toast("Configurações salvas com sucesso!");
      shell("settings");
    });

    document.getElementById("reset").addEventListener("click", function () {
      if (confirm("Tem certeza? Isso restaurará todo o catálogo padrão e limpará os pedidos de teste.")) {
        DB.reset();
        db = DB.get();
        toast("Dados restaurados com sucesso!");
        shell("dashboard");
      }
    });
  }

  window.toast = function (msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2400);
  };

  try {
    if (authed()) {
      shell("dashboard");
    } else {
      login();
    }
  } catch (err) {
    console.error("Falha ao iniciar o painel administrativo:", err);
  }
})();

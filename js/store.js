/* Camada de dados: semente em config.js, alterações salvas no navegador (localStorage). */
(function () {
  var C = window.SITE || {};
  var KEY = "site:" + (C.id || "loja-virtual2") + ":v1";

  function load() {
    var raw = null;
    try {
      var stored = localStorage.getItem(KEY);
      if (stored) raw = JSON.parse(stored);
    } catch (e) {
      console.warn("Falha ao recuperar localStorage, reiniciando dados padrão", e);
    }

    raw = raw && typeof raw === "object" ? raw : {};

    return {
      items: Array.isArray(raw.items) ? raw.items : (C.items || []).slice(),
      categories: Array.isArray(raw.categories) ? raw.categories : (C.categories || []).slice(),
      comments: Array.isArray(raw.comments) ? raw.comments : (C.comments || []).slice(),
      orders: Array.isArray(raw.orders) ? raw.orders : [],
      messages: Array.isArray(raw.messages) ? raw.messages : [],
      settings: Object.assign({
        name: C.name || "Loja Virtual",
        tagline: C.tagline || ""
      }, raw.settings || {}),
      cart: Array.isArray(raw.cart) ? raw.cart : []
    };
  }

  var db = load();

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(db));
    } catch (e) {
      console.error("Falha ao salvar no localStorage", e);
    }
  }

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  window.DB = {
    get: function () { return db; },
    save: save,
    uid: uid,
    reset: function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      db = load();
      return db;
    },
    item: function (id) {
      return db.items.find(function (i) { return String(i.id) === String(id); });
    },
    published: function () {
      return db.items.filter(function (i) { return i.status !== "rascunho"; });
    },
    commentsFor: function (id) {
      return db.comments.filter(function (c) { return String(c.itemId) === String(id) && c.status !== "oculto"; });
    }
  };

  window.esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  window.money = function (v) {
    return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  window.fmtDate = function (d) {
    try {
      var date = new Date(d);
      if (isNaN(date.getTime())) return "—";
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
    } catch (e) {
      return "—";
    }
  };
})();

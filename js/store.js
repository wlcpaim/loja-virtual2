/* Camada de persistência desacoplada com suporte a carrinho, cupons, pedidos e estoque */
(function () {
  var C = window.SITE || {};
  var KEY = "site:" + (C.id || "loja-virtual2") + ":v2";

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
      items: Array.isArray(raw.items) && raw.items.length ? raw.items : (C.items || []).slice(),
      categories: Array.isArray(raw.categories) && raw.categories.length ? raw.categories : (C.categories || []).slice(),
      comments: Array.isArray(raw.comments) ? raw.comments : (C.comments || []).slice(),
      coupons: Array.isArray(raw.coupons) && raw.coupons.length ? raw.coupons : (C.coupons || []).slice(),
      orders: Array.isArray(raw.orders) ? raw.orders : [],
      messages: Array.isArray(raw.messages) ? raw.messages : [],
      settings: Object.assign({
        name: C.name || "Loja Virtual2",
        tagline: C.tagline || "Produtos selecionados com entrega rápida e pagamento seguro.",
        phone: C.phone || "5511999998888",
        pixKey: C.pixKey || "contato@lojavirtual2.com.br",
        freeShippingFrom: C.freeShippingFrom || 299
      }, raw.settings || {}),
      cart: Array.isArray(raw.cart) ? raw.cart : [],
      appliedCoupon: raw.appliedCoupon || null
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
    },
    cartCount: function () {
      return (db.cart || []).reduce(function (sum, item) { return sum + (item.qty || 0); }, 0);
    },
    applyCoupon: function (code) {
      var cleanCode = String(code || "").trim().toUpperCase();
      var found = (db.coupons || []).find(function (c) { return c.code.toUpperCase() === cleanCode; });
      if (!found) {
        return { ok: false, message: "Cupom inválido ou expirado." };
      }
      db.appliedCoupon = found;
      save();
      return { ok: true, coupon: found, message: "Cupom " + found.code + " aplicado com sucesso!" };
    },
    removeCoupon: function () {
      db.appliedCoupon = null;
      save();
    },
    calcShipping: function (cep, subtotal) {
      var cleanCep = String(cep || "").replace(/\D/g, "");
      var threshold = Number(db.settings.freeShippingFrom) || 299;
      var hasFreeCoupon = db.appliedCoupon && db.appliedCoupon.type === "shipping";

      if (cleanCep.length !== 8) {
        return null;
      }

      var isFree = subtotal >= threshold || hasFreeCoupon;

      return [
        {
          id: "pac",
          name: "PAC Correios",
          deadline: "4 a 7 dias úteis",
          price: isFree ? 0 : 22.90
        },
        {
          id: "sedex",
          name: "SEDEX Expresso",
          deadline: "1 a 3 dias úteis",
          price: isFree ? 12.90 : 38.90
        }
      ];
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

(function () {
  "use strict";

  var cfg = window.RIDHA;
  if (!cfg) return;

  var $ = function (id) { return document.getElementById(id); };
  var el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  var items = {};
  cfg.menu.forEach(function (cat) {
    cat.items.forEach(function (it) { items[it.id] = it; });
  });
  var cart = {}; // id -> qty

  /* ---------- photo slots: fall back to a placeholder until the file exists ---------- */
  function watchImage(img) {
    var miss = function () { img.closest(".shot").classList.add("noimg"); };
    img.addEventListener("error", miss);
    if (img.complete && img.getAttribute("src") && img.naturalWidth === 0) miss();
  }
  document.querySelectorAll(".shot[data-slot] img").forEach(watchImage);

  /* ---------- spices: swap the drawing for the photo once it loads ---------- */
  document.querySelectorAll(".spice img").forEach(function (img) {
    var ok = function () { img.parentNode.classList.add("hasimg"); };
    if (img.complete && img.naturalWidth) ok(); else img.addEventListener("load", ok);
  });

  /* ---------- hero: spices drift at different speeds as the page scrolls ---------- */
  var hero = document.querySelector(".hero");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hero && !still) {
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        hero.style.setProperty("--sy", Math.min(window.scrollY, 1200));
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- menu ---------- */
  var menuList = $("menu-list");
  var chips = $("chips");

  function unitLabel(it, qty) {
    var u = it.unit || "portion";
    return qty === 1 || u === "kg" ? u : u + (u.slice(-1) === "s" ? "es" : "s");
  }

  function control(id) {
    var qty = cart[id] || 0;
    var it = items[id];
    if (!qty) {
      var add = el("button", "add", "+");
      add.type = "button";
      add.setAttribute("aria-label", "Add " + it.name + " to order");
      add.addEventListener("click", function () { setQty(id, 1, true); });
      return add;
    }
    var box = el("div", "qty");
    var minus = el("button", "", "−");
    minus.type = "button";
    minus.setAttribute("aria-label", "One less " + it.name);
    minus.addEventListener("click", function () { setQty(id, qty - 1, true); });
    var out = el("output", "", String(qty));
    out.setAttribute("aria-label", qty + " " + unitLabel(it, qty));
    var plus = el("button", "", "+");
    plus.type = "button";
    plus.setAttribute("aria-label", "One more " + it.name);
    plus.addEventListener("click", function () { setQty(id, qty + 1, true); });
    box.append(minus, out, plus);
    return box;
  }

  function photo(src, cls, size) {
    var fig = el("figure", "shot " + cls);
    var img = el("img");
    img.alt = "";
    img.loading = "lazy";
    img.width = size; img.height = size;
    var ph = el("figcaption", "shot-ph", src);
    ph.setAttribute("aria-hidden", "true");
    fig.append(img, ph);
    watchImage(img);
    img.src = src;
    return fig;
  }

  function renderMenu() {
    menuList.textContent = "";
    cfg.menu.forEach(function (cat) {
      var sec = el("section", "cat reveal");
      sec.dataset.cat = cat.id;
      var head = el("div", "cat-head");
      if (cat.image) head.append(photo(cat.image, "cat-shot", 800));
      var words = el("div");
      words.append(el("h3", "", cat.title));
      if (cat.ml) { var ml = el("p", "cat-ml", cat.ml); ml.lang = "ml"; words.append(ml); }
      if (cat.note) words.append(el("p", "cat-note", cat.note));
      head.append(words);
      var list = el("ul", "dishes");
      cat.items.forEach(function (it) {
        var li = el("li", "dish");
        if (it.image) li.append(photo(it.image, "dish-img", 800));
        var name = el("p", "dish-name", it.name);
        if (it.price != null) name.append(el("span", "dish-price", "₹" + it.price + " / " + (it.unit || "portion")));
        var ctl = el("div", "dish-ctl");
        ctl.dataset.ctl = it.id;
        ctl.append(control(it.id));
        var desc = el("p", "dish-desc", it.desc || "");
        li.append(name, ctl, desc);
        list.append(li);
      });
      sec.append(head, list);
      menuList.append(sec);
    });
  }

  function renderChips() {
    var all = [{ id: "all", title: "All" }].concat(cfg.menu);
    all.forEach(function (cat, i) {
      var b = el("button", "chip");
      b.type = "button";
      var circle = el("span", "chip-img");
      circle.setAttribute("aria-hidden", "true");
      if (cat.image) {
        var ci = el("img");
        ci.alt = ""; ci.loading = "lazy"; ci.width = 160; ci.height = 160;
        ci.src = cat.image;
        circle.append(ci);
      } else {
        circle.innerHTML = '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5"/></svg>';
      }
      b.append(circle, el("span", "", cat.title));
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () {
        chips.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
        menuList.querySelectorAll(".cat").forEach(function (sec) {
          sec.hidden = cat.id !== "all" && sec.dataset.cat !== cat.id;
          sec.classList.add("is-in");
        });
      });
      chips.append(b);
    });
  }

  /* ---------- cart ---------- */
  var cartList = $("cart");
  var cartEmpty = $("cart-empty");
  var cartBar = $("cart-bar");
  var orderVisible = false;

  function setQty(id, qty, keepFocus) {
    if (qty > 0) cart[id] = Math.min(qty, 999); else delete cart[id];
    var slot = menuList.querySelector('[data-ctl="' + id + '"]');
    if (slot) {
      var hadFocus = keepFocus && slot.contains(document.activeElement);
      var wasPlus = hadFocus && document.activeElement.textContent === "+";
      slot.textContent = "";
      slot.append(control(id));
      if (hadFocus) {
        var btns = slot.querySelectorAll("button");
        (cart[id] && !wasPlus && btns.length > 1 ? btns[0] : btns[btns.length - 1]).focus();
      }
    }
    renderCart();
    updatePreview(true);
  }

  function renderCart() {
    var ids = Object.keys(cart);
    cartList.textContent = "";
    ids.forEach(function (id) {
      var it = items[id];
      var li = el("li");
      var label = el("div");
      label.append(el("span", "", it.name), el("small", "", "per " + (it.unit || "portion")));
      var box = el("div", "qty");
      var minus = el("button", "", "−");
      minus.type = "button";
      minus.setAttribute("aria-label", "One less " + it.name);
      minus.addEventListener("click", function () { setQty(id, cart[id] - 1); });
      var out = el("output", "", String(cart[id]));
      var plus = el("button", "", "+");
      plus.type = "button";
      plus.setAttribute("aria-label", "One more " + it.name);
      plus.addEventListener("click", function () { setQty(id, cart[id] + 1); });
      box.append(minus, out, plus);
      li.append(label, box);
      cartList.append(li);
    });
    cartEmpty.hidden = ids.length > 0;
    $("cart-bar-text").textContent = ids.length + (ids.length === 1 ? " dish" : " dishes") + " in your order";
    cartBar.hidden = ids.length === 0 || orderVisible;
  }

  /* ---------- order form ---------- */
  var form = $("order-form");
  var fDate = $("f-date");
  var fGuests = $("f-guests");
  var guestsField = $("guests-field");
  var errorBox = $("form-error");
  var preview = $("preview");

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoLocal(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function earliestDate() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + (cfg.leadDays || 1));
    return d;
  }
  function niceDate(iso) {
    var p = iso.split("-");
    return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }
  function niceTime(t) {
    var p = t.split(":"), h = +p[0];
    return (h % 12 || 12) + ":" + p[1] + (h < 12 ? " AM" : " PM");
  }

  var minDate = isoLocal(earliestDate());
  fDate.min = minDate;
  $("earliest").textContent = niceDate(minDate);

  function orderType() { return form.elements.type.value; }

  function syncType() {
    var party = orderType() === "party";
    guestsField.hidden = !party;
    fGuests.required = party;
  }

  function buildMessage() {
    var d = new FormData(form);
    var name = (d.get("name") || "").trim();
    var date = d.get("date");
    var time = d.get("time");
    var area = (d.get("area") || "").trim();
    var notes = (d.get("notes") || "").trim();
    var party = orderType() === "party";
    var ids = Object.keys(cart);
    var lines = [];

    lines.push("*" + (party ? "Party order" : "New order") + " — " + cfg.name + "*");
    if (name) lines.push("Name: " + name);
    lines.push("Order type: " + (party ? "Party order" : "Regular order"));
    if (party && d.get("guests")) lines.push("Guests: " + d.get("guests"));
    if (date) lines.push("Needed on: " + niceDate(date) + (time ? ", " + niceTime(time) : ""));
    if (ids.length) {
      lines.push("");
      lines.push("*Dishes*");
      var total = 0, priced = true;
      ids.forEach(function (id) {
        var it = items[id], q = cart[id];
        lines.push("• " + q + " " + unitLabel(it, q) + " — " + it.name);
        if (it.price != null) total += it.price * q; else priced = false;
      });
      if (priced && total) lines.push("Estimated total: ₹" + total);
    }
    if (area) { lines.push(""); lines.push("Delivery address: " + area); }
    if (notes) { lines.push(""); lines.push("Notes: " + notes); }
    return { text: lines.join("\n"), empty: !name && !date && !time && !ids.length && !notes && !area };
  }

  function updatePreview(fresh) {
    var m = buildMessage();
    preview.textContent = "";
    if (m.empty) {
      preview.append(el("span", "ph", "Your order will appear here as you fill in the form…"));
      return;
    }
    // render *bold* like WhatsApp does
    m.text.split(/(\*[^*\n]+\*)/).forEach(function (part) {
      if (/^\*[^*\n]+\*$/.test(part)) preview.append(el("strong", "", part.slice(1, -1)));
      else preview.append(document.createTextNode(part));
    });
    if (fresh) {
      preview.classList.remove("is-fresh");
      void preview.offsetWidth;
      preview.classList.add("is-fresh");
    }
  }

  function waLink(text) {
    var num = String(cfg.whatsappNumber || "").replace(/\D/g, "");
    return "https://wa.me/" + num + (text ? "?text=" + encodeURIComponent(text) : "");
  }

  function fail(msg, field) {
    errorBox.textContent = msg;
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
  }

  form.addEventListener("input", function (e) {
    if (e.target.name === "type") syncType();
    if (e.target.removeAttribute) e.target.removeAttribute("aria-invalid");
    errorBox.textContent = "";
    updatePreview(false);
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.textContent = "";
    var name = $("f-name");
    var party = orderType() === "party";
    if (!name.value.trim()) return fail("Please tell us your name.", name);
    if (!fDate.value) return fail("Please choose the date you need the food.", fDate);
    if (fDate.value < minDate) return fail("We need at least one day's notice. The earliest date is " + niceDate(minDate) + ".", fDate);
    if (party && !(+fGuests.value > 0)) return fail("Please tell us how many guests.", fGuests);
    if (!$("f-area").value.trim()) return fail("Please give us the delivery address.", $("f-area"));
    if (!Object.keys(cart).length && !$("f-notes").value.trim()) {
      return fail(party
        ? "Add some dishes from the menu, or describe what you'd like in the notes."
        : "Add at least one dish from the menu, or describe your order in the notes.", $("f-notes"));
    }
    window.open(waLink(buildMessage().text), "_blank", "noopener");
  });

  /* ---------- party slider ---------- */
  var range = $("guests-range");
  var out = $("guests-out");
  var plates = $("plates");
  range.min = cfg.party.min; range.max = cfg.party.max; range.step = cfg.party.step; range.value = cfg.party.start;

  function syncParty() {
    var n = +range.value;
    out.textContent = n;
    var want = Math.min(60, Math.max(1, Math.round(n / 10)));
    while (plates.children.length < want) plates.append(el("i"));
    while (plates.children.length > want) plates.lastChild.remove();
  }
  range.addEventListener("input", syncParty);

  $("party-go").addEventListener("click", function () {
    form.elements.type.value = "party";
    syncType();
    fGuests.value = range.value;
    updatePreview(true);
    $("order").scrollIntoView();
    $("f-name").focus({ preventScroll: true });
  });

  /* ---------- scroll: steps, reveals, floating bar ---------- */
  var stage = document.querySelector(".day-stage");
  var steps = document.querySelectorAll(".step");

  if ("IntersectionObserver" in window) {
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        steps.forEach(function (s) { s.classList.toggle("is-active", s === en.target); });
        if (stage) stage.dataset.step = en.target.dataset.step;
      });
    }, { rootMargin: "-50% 0px -50% 0px" });
    steps.forEach(function (s) { stepIO.observe(s); });
    if (steps[0]) steps[0].classList.add("is-active");

    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revealIO.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    var watchReveals = function () {
      document.querySelectorAll(".reveal:not(.is-in), .reveal-clip:not(.is-in)").forEach(function (n) { revealIO.observe(n); });
    };

    new IntersectionObserver(function (entries) {
      orderVisible = entries[0].isIntersecting;
      cartBar.hidden = !Object.keys(cart).length || orderVisible;
    }, { rootMargin: "-20% 0px -20% 0px" }).observe($("order"));
  } else {
    steps.forEach(function (s) { s.classList.add("is-active"); });
    document.documentElement.classList.remove("js");
  }

  /* ---------- about video: plays only while on screen, never for reduced motion ---------- */
  var video = $("about-video");
  if (video && !still && "IntersectionObserver" in window) {
    video.addEventListener("playing", function () { video.classList.add("is-playing"); });
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      } else {
        video.pause();
      }
    }, { rootMargin: "100px" }).observe(video);
  }

  /* ---------- dish photos with a stand-in until the new photo exists ---------- */
  document.querySelectorAll("img[data-fallback]").forEach(function (img) {
    var swap = function () {
      if (img.getAttribute("src") !== img.dataset.fallback) img.src = img.dataset.fallback;
    };
    img.addEventListener("error", swap);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute("src")) swap();
  });

  /* ---------- hero: the plate changes between Malabar dishes ---------- */
  var heroPlates = document.querySelectorAll("#hero-plates .plate");
  var plateName = $("plate-name");
  if (heroPlates.length > 1 && !still) {
    var current = 0;
    setInterval(function () {
      if (document.hidden) return;
      heroPlates[current].classList.remove("is-on");
      current = (current + 1) % heroPlates.length;
      var next = heroPlates[current];
      var img = next.querySelector("img");
      if (img.loading === "lazy") img.loading = "eager";
      next.classList.add("is-on");
      if (plateName) plateName.textContent = next.dataset.name;
    }, 3500);
  }

  /* ---------- Malabar table: add a dish, or jump to its part of the menu ---------- */
  function showCategory(catId) {
    var chip = chips.querySelectorAll(".chip")[cfg.menu.findIndex(function (c) { return c.id === catId; }) + 1];
    if (chip) chip.click();
    $("menu").scrollIntoView();
  }
  document.querySelectorAll(".fav-add").forEach(function (b) {
    var label = b.textContent;
    b.addEventListener("click", function () {
      var id = b.dataset.add;
      setQty(id, (cart[id] || 0) + 1);
      b.classList.add("is-added");
      b.textContent = "Added ✓ (" + cart[id] + ")";
      clearTimeout(b._t);
      b._t = setTimeout(function () { b.classList.remove("is-added"); b.textContent = label; }, 1800);
    });
  });
  document.querySelectorAll(".fav-see").forEach(function (b) {
    b.addEventListener("click", function () { showCategory(b.dataset.cat); });
  });

  /* ---------- start ---------- */
  renderChips();
  renderMenu();
  if (typeof watchReveals === "function") watchReveals();
  renderCart();
  syncType();
  syncParty();
  updatePreview(false);
  document.querySelectorAll(".wa-direct").forEach(function (link) {
    link.href = waLink("Hi " + cfg.name + ", I'd like to place an order.");
  });
  $("footer-wa").href = waLink("Hi " + cfg.name + ", I'd like to ask about an order.");
  $("footer-wa").target = "_blank";
  $("footer-wa").rel = "noopener";
})();

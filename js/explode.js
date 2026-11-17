/*
 * "Inside the biryani": a biryani pot that opens layer by layer as you scroll.
 *
 * Each layer shows images/layer-*.png when that file exists (transparent PNG, same width and
 * camera angle for every layer). Until then a drawn placeholder is shown instead.
 */
(function () {
  "use strict";

  var section = document.getElementById("inside");
  var stack = document.getElementById("stack");
  if (!section || !stack) return;

  var stage = section.querySelector(".explode-stage");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- placeholder drawings (viewBox width 400) ---------- */
  var seed = 7;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function inEllipse(cx, cy, rx, ry) {
    var a = rnd() * Math.PI * 2, r = Math.sqrt(rnd());
    return [cx + Math.cos(a) * rx * r, cy + Math.sin(a) * ry * r];
  }
  function BRASS(k) { return '<linearGradient id="g-brass-' + k + '" x1="0" x2="1"><stop offset="0" stop-color="#6e4a14"/><stop offset=".3" stop-color="#d9a64c"/><stop offset=".5" stop-color="#f6d58c"/><stop offset=".72" stop-color="#c48a2e"/><stop offset="1" stop-color="#5e3e10"/></linearGradient>'; }

  function disc(top, side, inner) {
    return '<path d="M30 45V80A170 34 0 0 0 370 80V45A170 34 0 0 1 30 45Z" fill="' + side + '"/>' +
      '<ellipse cx="200" cy="45" rx="170" ry="34" fill="' + top + '"/>' + inner;
  }
  function grains(n, colours) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var p = inEllipse(200, 45, 160, 29);
      out += '<ellipse cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" rx="4" ry="1.5" transform="rotate(' + Math.round(rnd() * 180) + ' ' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ')" fill="' + colours[i % colours.length] + '"/>';
    }
    return out;
  }
  function leaves(n, cx, cy, rx, ry, colour) {
    var out = "";
    for (var i = 0; i < n; i++) {
      var p = inEllipse(cx, cy, rx, ry);
      out += '<path d="M-9 0C-4-6 4-6 9 0 4 6-4 6-9 0Z" fill="' + colour + '" transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + Math.round(rnd() * 180) + ')"/>';
    }
    return out;
  }

  var draw = {
    lid: function () {
      return '<svg class="ph" viewBox="0 0 400 150" aria-hidden="true"><defs>' + BRASS('lid') + '</defs>' +
        '<ellipse cx="200" cy="120" rx="176" ry="26" fill="#7a5418"/>' +
        '<path d="M24 120C34 50 366 50 376 120A176 26 0 0 1 24 120Z" fill="url(#g-brass-lid)"/>' +
        '<path d="M60 100C80 74 130 62 170 60" fill="none" stroke="#fff6dc" stroke-opacity=".45" stroke-width="8" stroke-linecap="round"/>' +
        '<ellipse cx="200" cy="56" rx="30" ry="9" fill="#8a5f1c"/><path d="M182 56C182 30 218 30 218 56Z" fill="url(#g-brass-lid)"/><circle cx="200" cy="30" r="9" fill="#f0c86e"/></svg>';
    },
    seal: function () {
      var dots = "";
      for (var i = 0; i < 26; i++) {
        var a = (i / 26) * Math.PI * 2;
        dots += '<circle cx="' + (200 + Math.cos(a) * 176).toFixed(1) + '" cy="' + (45 + Math.sin(a) * 36).toFixed(1) + '" r="2.4" fill="#c9a86a"/>';
      }
      return '<svg class="ph" viewBox="0 0 400 90" aria-hidden="true"><ellipse cx="200" cy="45" rx="176" ry="36" fill="none" stroke="#e9d6aa" stroke-width="16"/>' +
        '<ellipse cx="200" cy="49" rx="176" ry="36" fill="none" stroke="#b99657" stroke-opacity=".5" stroke-width="4"/>' + dots + '</svg>';
    },
    garnish: function () {
      var out = "", i, p;
      for (i = 0; i < 34; i++) {
        p = inEllipse(200, 75, 165, 50);
        out += '<path d="M-8 0Q0-8 8 0" fill="none" stroke="' + (i % 3 ? "#8a3f12" : "#b25a1c") + '" stroke-width="4" stroke-linecap="round" transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + Math.round(rnd() * 360) + ')"/>';
      }
      for (i = 0; i < 9; i++) {
        p = inEllipse(200, 75, 150, 44);
        out += '<path d="M-10 4C-12-6-2-11 6-9c6 2 9 7 9 13-4-5-9-6-14-5-5 1-8 5-11 5z" fill="#e8c48a" transform="translate(' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + ') rotate(' + Math.round(rnd() * 360) + ')"/>';
      }
      for (i = 0; i < 9; i++) {
        p = inEllipse(200, 75, 150, 44);
        out += '<ellipse cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" rx="5" ry="3.5" fill="#4a1f2a"/>';
      }
      out += leaves(10, 200, 75, 150, 44, "#3f8f5f");
      out += '<ellipse cx="140" cy="70" rx="24" ry="15" fill="#fbf6ea"/><circle cx="140" cy="70" r="9" fill="#f2b632"/>' +
        '<ellipse cx="262" cy="86" rx="24" ry="15" fill="#fbf6ea"/><circle cx="262" cy="86" r="9" fill="#f2b632"/>';
      return '<svg class="ph" viewBox="0 0 400 150" aria-hidden="true">' + out + '</svg>';
    },
    rice: function () {
      var streaks = "";
      for (var i = 0; i < 7; i++) {
        var p = inEllipse(200, 45, 130, 22);
        streaks += '<ellipse cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" rx="' + (16 + rnd() * 20).toFixed(1) + '" ry="5" fill="#e8891c" fill-opacity=".55"/>';
      }
      return '<svg class="ph" viewBox="0 0 400 130" aria-hidden="true">' +
        disc("#f2dfae", "#d4b170", streaks + grains(170, ["#fffaf0", "#f7e7bf", "#f5c66a"]) + leaves(5, 200, 45, 140, 24, "#4f9d6b")) + '</svg>';
    },
    masala: function () {
      var chunks = "";
      for (var i = 0; i < 15; i++) {
        var p = inEllipse(200, 45, 140, 24), rx = 13 + rnd() * 10;
        chunks += '<ellipse cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + (rx * 0.6).toFixed(1) + '" fill="' + (i % 2 ? "#6b2a0f" : "#a5501f") + '"/>' +
          '<ellipse cx="' + (p[0] - 3).toFixed(1) + '" cy="' + (p[1] - 3).toFixed(1) + '" rx="' + (rx * 0.4).toFixed(1) + '" ry="2" fill="#e08a4a" fill-opacity=".5"/>';
      }
      return '<svg class="ph" viewBox="0 0 400 130" aria-hidden="true">' +
        disc("#8f3814", "#5e230c", chunks + leaves(7, 200, 45, 140, 24, "#2f7a4f")) + '</svg>';
    },
    pot: function () {
      return '<svg class="ph" viewBox="0 0 400 220" aria-hidden="true"><defs>' + BRASS('pot') + '</defs>' +
        '<ellipse cx="200" cy="44" rx="170" ry="34" fill="#2b1a07"/>' +
        '<path d="M30 44C26 120 70 205 200 208 330 205 374 120 370 44A170 34 0 0 1 30 44Z" fill="url(#g-brass-pot)"/>' +
        '<ellipse cx="200" cy="44" rx="172" ry="35" fill="none" stroke="#f3cf7f" stroke-width="7"/>' +
        '<path d="M42 116C90 146 310 146 358 116" fill="none" stroke="#8a5d1a" stroke-width="5"/>' +
        '<path d="M70 84C72 130 100 168 140 186" fill="none" stroke="#fff6dc" stroke-opacity=".35" stroke-width="10" stroke-linecap="round"/>' +
        '<ellipse cx="22" cy="74" rx="11" ry="18" fill="none" stroke="#c48a2e" stroke-width="6"/><ellipse cx="378" cy="74" rx="11" ry="18" fill="none" stroke="#a87424" stroke-width="6"/></svg>';
    }
  };

  /* ---------- the layers, top to bottom ----------
     closed: offset in layer widths (W) when the pot is shut
     open:   offset in stage heights (H) when fully opened */
  var LAYERS = [
    { id: "lid",     label: "Brass lid",                     sub: "Holds the steam in",                side: "right", z: 7, closed: -0.17,  open: -0.38, rOpen: -6 },
    { id: "seal",    label: "Dough seal",                    sub: "The pot is sealed for dum cooking", side: "left",  z: 6, closed: -0.055, open: -0.255 },
    { id: "garnish", label: "Onion, cashew, raisin",  sub: "Finished with mint and egg",        side: "right", z: 5, closed: -0.03,  open: -0.13, sClosed: 0.7, sOpen: 1.15 },
    { id: "rice",    label: "Kaima rice",                    sub: "Short-grain, saffron and ghee",     side: "left",  z: 4, closed: -0.005, open: 0.0,   sClosed: 0.86 },
    { id: "masala",  label: "Chicken masala",                sub: "Slow-cooked at the bottom",         side: "right", z: 3, closed: 0.02,   open: 0.135, sClosed: 0.86, hide: true },
    { id: "pot",     label: "Chembu",                        sub: "The brass biryani pot",             side: "left",  z: 1, closed: 0.12,   open: 0.31 }
  ];

  /* Geometry for the real photos (images/layer-*.webp).
     k:      width relative to the pot
     closed: offset from the stage centre, in pot widths, while the pot is shut
             (food starts inside the pot, which is drawn in front of it, and rises out)
     gap:    space left under this layer when opened, as a share of its own height
             (negative = it overlaps the next one, like the ring around the garnish) */
  var PHOTO = {
    lid:     { k: 0.8,  z: 6, closed: -0.185, gap: -0.25, rOpen: -5 },
    seal:    { k: 0.82, z: 5, closed: -0.06,  gap: -0.45, rOpen: 3, hide: true },
    garnish: { k: 0.9,  z: 3, closed: 0.08,   gap: -0.35, sClosed: 0.8 },
    rice:    { k: 0.78, z: 2, closed: 0.13,   gap: 0.04,  sClosed: 0.88, rOpen: -3 },
    masala:  { k: 0.78, z: 1, closed: 0.18,   gap: 0.04,  sClosed: 0.88, rOpen: 3 },
    pot:     { k: 1,    z: 4, closed: 0.18,   gap: 0 }
  };
  var photoMode = false, loaded = 0;
  var head = section.querySelector(".explode-head");
  var cta = section.querySelector(".explode-cta");
  var W = 0, openY = [];

  /* Size the pot so the opened stack fills the stage top to bottom, and work out where
     every layer sits when opened. Runs on start and whenever the window changes size. */
  function layout() {
    if (!photoMode) return;
    var H = stage.clientHeight;
    var narrow = stack.clientWidth < 640;
    var padTop = Math.round(H * 0.04) + 8;
    var padBot = (cta ? cta.offsetHeight : 52) + Math.round(H * 0.05) + 8;
    var rel = nodes.map(function (n) { var g = PHOTO[n.L.id]; return g.k * n.aspect; });
    var total = rel.reduce(function (sum, h, i) { return sum + h * (1 + (i < rel.length - 1 ? PHOTO[nodes[i].L.id].gap : 0)); }, 0);
    var maxW = narrow ? stack.clientWidth * 0.52 : Math.min(stack.clientWidth * 0.42, 400);
    W = Math.min((H - padTop - padBot) / total, maxW);
    stack.style.setProperty("--wpx", W.toFixed(1) + "px");
    var cursor = (padTop - padBot) / 2 - (total * W) / 2;
    openY = rel.map(function (h, i) {
      var px = h * W, centre = cursor + px / 2;
      cursor += px * (1 + PHOTO[nodes[i].L.id].gap);
      return centre;
    });
  }

  function usePhotos() {
    photoMode = true;
    stack.classList.add("photo");
    nodes.forEach(function (n) {
      var g = PHOTO[n.L.id];
      n.el.classList.add("hasimg");
      n.el.style.setProperty("--k", g.k);
      n.el.style.zIndex = g.z;
    });
    layout();
    render(still ? 1 : progress());
  }

  var nodes = LAYERS.map(function (L) {
    var layer = document.createElement("div");
    layer.className = "layer layer-" + L.id;
    layer.style.zIndex = L.z;
    layer.innerHTML = draw[L.id]();
    var img = new Image();
    img.alt = "";
    img.decoding = "async";
    // switch to photos only once all six have loaded, so real and drawn layers never mix
    img.onload = function () {
      node.aspect = img.naturalHeight / img.naturalWidth;
      // wait for the picture to be decoded, but never longer than a second
      var ready = Promise.race([
        img.decode ? img.decode().catch(function () {}) : Promise.resolve(),
        new Promise(function (done) { setTimeout(done, 1000); })
      ]);
      ready.then(function () { if (++loaded === LAYERS.length) usePhotos(); });
    };
    img.src = "images/layer-" + L.id + ".webp";
    layer.prepend(img);
    var tag = document.createElement("span");
    tag.className = "tag " + L.side;
    tag.innerHTML = "<i></i><span><b></b><small></small></span>";
    tag.querySelector("b").textContent = L.label;
    tag.querySelector("small").textContent = L.sub;
    layer.append(tag);
    stack.append(layer);
    var node = { L: L, el: layer, tag: tag, aspect: 0.6 };
    return node;
  });

  /* ---------- scroll → progress → positions ---------- */
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function render(p) {
    if (seq) { seq.render(p); return; }
    var H = stack.clientHeight || 500;
    var Wd = photoMode ? W : (nodes[0].el.offsetWidth || 300);
    // on phones the labels all sit on the right, so the pot slides left as it opens
    var narrow = stack.clientWidth < 640;
    var x = narrow ? -0.13 * stack.clientWidth * ease(clamp(p / 0.3)) : 0;
    nodes.forEach(function (n, i) {
      var L = photoMode ? PHOTO[n.L.id] : n.L;
      var start = 0.06 + i * 0.05;
      var t = ease(clamp((p - start) / 0.45));
      var target = photoMode ? openY[i] : L.open * H;
      var y = lerp(L.closed * Wd, target, t);
      var s = lerp(L.sClosed || 1, L.sOpen || 1, t);
      var r = lerp(0, L.rOpen || 0, t);
      n.el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0) rotate(" + r.toFixed(2) + "deg) scale(" + s.toFixed(3) + ")";
      n.el.style.opacity = L.hide ? clamp(t * 4).toFixed(3) : "";
      n.tag.style.opacity = clamp((t - 0.7) / 0.3).toFixed(3);
      n.tag.style.rotate = (-r).toFixed(2) + "deg";
      n.tag.style.scale = (1 / s).toFixed(3);
    });
    // the title makes room for the lid as the pot opens
    if (head) head.style.opacity = (1 - clamp((p - 0.03) / 0.12)).toFixed(3);
    section.classList.toggle("is-open", p > 0.82);
  }

  /* ---------- video mode ----------
     If images/explode/frames.json exists, the pot is played as a real video, frame by frame,
     as you scroll (frames are images/explode/f-001.webp …). The drawn/photo layers step aside. */
  var seq = null;

  function useFrames(m) {
    var wrap = document.createElement("div");
    wrap.className = "seq";
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    wrap.append(canvas);
    var ctx = canvas.getContext("2d");
    var pad = function (i) { return ("00" + (i + 1)).slice(-3); };
    var frames = new Array(m.count);
    var shown = -1;

    var tags = (m.labels || []).map(function (L) {
      var t = document.createElement("span");
      t.className = "tag seq-tag " + (L.side || "right");
      t.innerHTML = "<i></i><span><b></b><small></small></span>";
      t.querySelector("b").textContent = L.label;
      t.querySelector("small").textContent = L.sub || "";
      t.style.top = (L.y * 100) + "%";
      t._L = L;
      wrap.append(t);
      return t;
    });
    // place labels beside each layer; on phones they all go on the right
    function placeTags(narrow) {
      tags.forEach(function (t) {
        var L = t._L, side = narrow ? "right" : (L.side || "right");
        var x = side === "right" ? (L.side === "left" ? 1 - L.x : L.x) : L.x;
        t.className = "tag seq-tag " + side;
        t.style.left = side === "right" ? (x * 100) + "%" : "auto";
        t.style.right = side === "left" ? ((1 - x) * 100) + "%" : "auto";
      });
    }

    function load(i) {
      if (frames[i]) return;
      var img = new Image();
      img.decoding = "async";
      img.onload = function () { img.ready = true; if (shown === -1 || Math.abs(i - target) < Math.abs(shown - target)) draw(target); };
      img.src = "images/explode/f-" + pad(i) + "." + (m.ext || "webp");
      frames[i] = img;
    }
    var target = 0;
    function draw(i) {
      // nearest frame that has loaded
      for (var d = 0; d < m.count; d++) {
        var a = frames[i - d], b = frames[i + d];
        var f = (a && a.ready) ? a : (b && b.ready) ? b : null;
        if (f) {
          if (f === frames[shown]) return;
          ctx.drawImage(f, 0, 0, canvas.width, canvas.height);
          shown = frames.indexOf(f);
          return;
        }
      }
    }
    function size() {
      var H = stage.clientHeight, Wd = stage.clientWidth;
      var padTop = Math.round(H * 0.03), padBot = (cta ? cta.offsetHeight : 52) + Math.round(H * 0.04);
      var h = H - padTop - padBot, w = h * m.width / m.height;
      var narrow = Wd < 640;
      if (w > Wd * (narrow ? 0.62 : 0.9)) { w = Wd * (narrow ? 0.62 : 0.9); h = w * m.height / m.width; }
      wrap.style.width = w + "px";
      wrap.style.height = h + "px";
      wrap.style.top = (padTop + (H - padTop - padBot - h) / 2) + "px";
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      placeTags(narrow);
      shown = -1;
      draw(target);
    }

    seq = {
      render: function (p) {
        var t = clamp((p - 0.05) / 0.78);
        target = Math.round(t * (m.count - 1));
        draw(target);
        var narrow = stage.clientWidth < 640;
        wrap.style.translate = (narrow ? -0.12 * stage.clientWidth * ease(clamp(p / 0.25)) : 0).toFixed(1) + "px 0";
        var labels = clamp((t - 0.88) / 0.12).toFixed(3);
        tags.forEach(function (tg) { tg.style.opacity = labels; });
        if (head) head.style.opacity = (1 - clamp((p - 0.03) / 0.12)).toFixed(3);
        section.classList.toggle("is-open", p > 0.82);
      },
      size: size
    };

    stack.hidden = true;
    section.classList.add("is-seq");
    stage.insertBefore(wrap, cta);
    load(0); load(m.count - 1);
    for (var step = 8; step >= 1; step = step / 2 | 0) {
      for (var i = 0; i < m.count; i += step) load(i);
      if (step === 1) break;
    }
    size();
    render(still ? 1 : progress());
  }

  if (window.fetch) {
    fetch("images/explode/frames.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (m) { if (m && m.count) useFrames(m); })
      .catch(function () {});
  }

  function progress() {
    var rect = section.getBoundingClientRect();
    var travel = section.offsetHeight - stage.offsetHeight;
    var top = parseFloat(getComputedStyle(stage).top) || 0;
    return travel > 0 ? clamp((top - rect.top) / travel) : 1;
  }

  if (still) {
    render(1);
    window.addEventListener("resize", function () { if (seq) seq.size(); layout(); render(1); });
    return;
  }

  var queued = false;
  function update() {
    queued = false;
    render(progress());
  }
  function queue() {
    if (!queued) { queued = true; requestAnimationFrame(update); }
  }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", function () { if (seq) seq.size(); layout(); queue(); });
  update();
})();

# Ridha Cloud — design memory

Decided 2026-11-16.

## Story (inferred from a short brief; no founder facts invented)
- Malabar cloud kitchen in Kozhikode, Kerala. Orders one day ahead, sent on WhatsApp. Takes party orders.
- Central metaphor: **the day in between** — "Order today. Feast tomorrow." The one-day notice is the promise (cooked to order), not fine print.
- Motion language: `organic` — slow settle, no bounce. Tokens `--dur*`, `--ease*` in `css/styles.css`.
- Placeholders to fill: WhatsApp number, real menu and prices, pickup/delivery details, opening hours, photos.

## Structure (single page, static HTML/CSS/JS, no build)
1. Cold open — headline, dum pot on banana leaf, four facts
2. The day — sticky dial, sun travels Today → Tomorrow across four steps (Order, Confirm, Cook, Feast)
3. Menu — printed-card layout, category chips, Add / quantity
4. Party orders — guest slider, hands off to the order form
5. Order — form with a live WhatsApp message preview (signature element)

## Tokens
- Colour: leaf green `#12372a`, turmeric `#e0a526`, chilli `#a8351b`, rice `#f6efe0`, paper `#fffaf0`, ink `#1f1a14`.
- Type: Fraunces (display, italic for accents), Instrument Sans (body).
- Menu and settings live in `js/config.js`; nothing else needs editing for content changes.

## 2026-11-16 — Kerala theme overhaul (user asked for Malabar/Kerala vibes)
- Kept: story, section order, all form fields, order flow, palette base, fonts.
- Added motifs: kasavu double gold border (`.kasavu`, gold rings on photos and menu card), banana leaves that sway, spices that drift with scroll, a boat crossing the sea from Today to Tomorrow, coconut palms and waves above the footer, dish-name ticker.
- Hero is now dark leaf green with a turning plate on a banana leaf and a Malayalam watermark.
- Malayalam accents in Anek Malayalam (place name, section tags, category names).
- New About section. Photo slots in `images/` with placeholders; see `images/IMAGE-GUIDE.md`.

## 2026-11-16 — Black and gold (user asked for luxury, classy cloud-kitchen look)
- Reference chosen by the user's link: Pixora UI "Restaurants App Login Signup Screens UI" — near-black, dimmed food photography, one gold accent, round gold emblem, translucent fields. Direction only; nothing copied from the kit.
- Tokens replaced: bg `#0e0d0b`, surface `#16140f`, gold `#d4a53a`, ivory `#f3ecdc`, muted `#b9af9b`. Type: Cormorant Garamond (display) + Jost (labels, body), small caps-style tracked labels.
- Removed the illustrated leaves, spices, palms and waves. Kept: kasavu gold lines, Malayalam accents, sun-and-boat dial, ticker, photos, video, all content and the order flow.

## 2026-11-16 — Charcoal + saffron redesign (user references: dark grill-house site, dark burger app, KFC-style app, red noodle site, exploded burger poster)
- Charcoal grain background, saffron-orange accent with glow, Outfit (bold sans) + Kaushan Script accents.
- New signature: "Inside the biryani" — sticky scene (js/explode.js) where a brass pot opens layer by layer on scroll: lid, dough seal, garnish, rice, masala, pot. Drawn placeholders until images/layer-*.png exist.
- Menu: round photo category chips, dish cards with round "+" buttons. Party: red-orange offer banner. Steps: four cards.

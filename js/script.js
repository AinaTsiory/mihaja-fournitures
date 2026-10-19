'use strict';
/* ===== Configuration (modifiable) ===== */
const WHATSAPP_NUMBER = '261345521919';
const STORAGE_KEY = 'mihaja-cart-v1';
const L = (c, w = 6) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
// Illustrations vectorielles colorées (viewBox 120×90). Remplaçables par des photos via le champ `image`.
const ICONS = {
  cutter: '<rect x="22" y="38" width="70" height="20" rx="5" fill="#F4A62A"/><path d="M92 38l16 10-16 10z" fill="#94A3B8"/><rect x="34" y="44" width="26" height="8" rx="2" fill="#17365D"/>',
  pad: '<rect x="12" y="20" width="96" height="56" rx="6" fill="#17365D"/><rect x="12" y="20" width="96" height="11" rx="5" fill="#F4A62A"/><rect x="28" y="42" width="44" height="5" rx="2" fill="#fff" opacity=".6"/><rect x="28" y="54" width="30" height="5" rx="2" fill="#fff" opacity=".4"/>',
  stapler: '<rect x="16" y="56" width="88" height="14" rx="4" fill="#17365D"/><path d="M18 54L100 36v12L18 60z" fill="#F4A62A"/><circle cx="96" cy="44" r="3" fill="#fff"/>',
  remover: '<path d="M16 64h88l-10-16H46z" fill="#E11D48"/><rect x="16" y="64" width="88" height="8" rx="3" fill="#17365D"/><path d="M46 48l-14-8" ' + L('#94A3B8', 5) + '/>',
  agenda: '<rect x="30" y="14" width="60" height="44" rx="4" fill="#fff" stroke="#17365D" stroke-width="3"/><path d="M60 14v44M38 28h14M68 28h14M38 38h14M68 38h14" ' + L('#94A3B8', 2.5) + '/><path d="M22 66h76l-8 12H30z" fill="#F4A62A"/>',
  pot: '<path d="M30 32h60l-6 48H36z" fill="#17365D"/><path d="M60 32v48" stroke="#fff" stroke-width="2" opacity=".5"/><path d="M42 32L38 10M54 32l2-24M70 32l8-22M82 32l8-16" ' + L('#F4A62A', 5) + '/><path d="M50 10v22" ' + L('#2563EB', 5) + '/>',
  folder: '<rect x="20" y="22" width="80" height="54" rx="6" fill="#F4A62A"/><path d="M20 38h80M20 50h80M20 62h80" stroke="#E89418" stroke-width="3"/><rect x="52" y="12" width="16" height="12" rx="3" fill="#17365D"/>',
  box: '<rect x="30" y="16" width="60" height="62" rx="4" fill="#2563EB"/><rect x="30" y="16" width="14" height="62" fill="#1E40AF"/><rect x="50" y="30" width="34" height="16" rx="3" fill="#fff"/><circle cx="67" cy="62" r="6" fill="#fff" opacity=".7"/>',
  notebook: '<rect x="32" y="10" width="56" height="70" rx="4" fill="#16A34A"/><path d="M32 22h-5M32 36h-5M32 50h-5M32 64h-5" ' + L('#fff', 3) + '/><rect x="42" y="22" width="36" height="16" rx="3" fill="#fff"/><path d="M48 30h24" ' + L('#16A34A', 3) + '/>',
  pens: '<path d="M30 74L42 16" ' + L('#2563EB', 8) + '/><path d="M50 74L58 16" ' + L('#111827', 8) + '/><path d="M70 74L74 16" ' + L('#DC2626', 8) + '/><path d="M90 74L90 16" ' + L('#16A34A', 8) + '/>',
  pencils: '<path d="M26 74V28M40 74V20M54 74V28M68 74V20M82 74V28M96 74V20" stroke-width="9" stroke-linecap="round" stroke="#DC2626"/><path d="M40 74V20" ' + L('#F4A62A', 9) + '/><path d="M68 74V20" ' + L('#16A34A', 9) + '/><path d="M96 74V20" ' + L('#2563EB', 9) + '/><path d="M54 74V28" ' + L('#7C3AED', 9) + '/><path d="M82 74V28" ' + L('#EC4899', 9) + '/>',
  case: '<rect x="16" y="30" width="88" height="38" rx="19" fill="#7C3AED"/><path d="M30 42h60" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/><rect x="82" y="38" width="10" height="10" rx="3" fill="#F4A62A"/>',
  ruler: '<rect x="8" y="32" width="104" height="26" rx="3" fill="#BAE6FD" stroke="#0369A1" stroke-width="2"/><path d="M18 32v10M28 32v6M38 32v10M48 32v6M58 32v10M68 32v6M78 32v10M88 32v6M98 32v10" ' + L('#0369A1', 2) + '/>',
  eraser: '<rect x="26" y="30" width="68" height="30" rx="7" fill="#fff" stroke="#94A3B8" stroke-width="3"/><path d="M62 30h25a7 7 0 0 1 7 7v16a7 7 0 0 1-7 7H62z" fill="#2563EB"/>',
  scissors: '<circle cx="40" cy="64" r="11" ' + L('#E11D48', 6) + '/><circle cx="74" cy="64" r="11" ' + L('#E11D48', 6) + '/><path d="M45 54L84 12M69 54L30 12" ' + L('#64748B', 6) + '/>',
  compass: '<circle cx="60" cy="14" r="7" fill="#F4A62A"/><path d="M60 20L36 76M60 20l24 56" ' + L('#475569', 6) + '/><path d="M42 58h36" ' + L('#475569', 3) + '/>',
  glue: '<rect x="40" y="32" width="40" height="48" rx="7" fill="#F4A62A"/><rect x="44" y="12" width="32" height="22" rx="5" fill="#17365D"/><rect x="48" y="46" width="24" height="12" rx="3" fill="#fff"/>',
  binder: '<rect x="32" y="8" width="56" height="74" rx="4" fill="#DC2626"/><rect x="32" y="8" width="14" height="74" fill="#991B1B"/><circle cx="39" cy="26" r="3.5" fill="#fff"/><circle cx="39" cy="45" r="3.5" fill="#fff"/><circle cx="39" cy="64" r="3.5" fill="#fff"/><rect x="54" y="26" width="26" height="16" rx="2" fill="#fff"/>',
  sheets: '<rect x="40" y="18" width="54" height="62" rx="3" fill="#E2E8F0"/><rect x="32" y="12" width="54" height="62" rx="3" fill="#fff" stroke="#94A3B8" stroke-width="2"/><path d="M32 28h54M32 38h54M32 48h54M32 58h54M46 12v62M60 12v62M74 12v62" stroke="#93C5FD" stroke-width="1.5"/>',
  marker: '<path d="M38 72l30-42 16 12-28 42z" fill="#FACC15"/><path d="M68 30l8-12 16 12-8 12z" fill="#17365D"/><path d="M28 80h44" ' + L('#FDE047', 7) + '/>'
};
// price : entier en Ariary, ou null = sur demande (jamais ajouté au panier).
const PRODUCTS = [
  { id: 'cutter', name: 'Cutter / Massicot de poche', price: 5000, icon: 'cutter', desc: "Un outil pratique pour découper le papier, le carton et les matériaux fins, avec les précautions d'utilisation nécessaires." },
  { id: 'sous-main', name: 'Sous-main de bureau', price: 20000, icon: 'pad', desc: 'Un accessoire pratique pour aménager votre bureau et créer un espace de travail confortable.' },
  { id: 'agrafeuse', name: 'Agrafeuse de bureau', price: 10000, icon: 'stapler', promo: true, desc: 'Un indispensable pour assembler et organiser facilement vos documents.' },
  { id: 'desagrafeuse', name: 'Désagrafeuse', price: 5000, icon: 'remover', promo: true, desc: 'Retirez rapidement les agrafes de vos documents.' },
  { id: 'support-agenda', name: "Support d'agenda", price: null, icon: 'agenda', desc: 'Gardez votre agenda ouvert et bien en vue sur votre bureau.' },
  { id: 'pot-bureau', name: 'Pot multi-compartiments pour bureau', price: null, icon: 'pot', desc: 'Rangez stylos, ciseaux et petits accessoires à portée de main.' },
  { id: 'porte-documents', name: 'Porte-documents extensible', price: null, icon: 'folder', desc: 'Classez et transportez vos documents par catégorie.' },
  { id: 'boite-classement', name: 'Boîte / Organisateur de classement rigide', price: null, icon: 'box', desc: 'Une boîte rigide pour archiver et organiser vos dossiers.' },
  { id: 'cahier-200', name: 'Cahier grand format 200 pages', price: 3500, icon: 'notebook', desc: 'Un grand cahier de 200 pages pour les cours et les notes.' },
  { id: 'stylos-4', name: 'Lot de 4 stylos à bille (Bleu, Noir, Rouge, Vert)', price: 2500, icon: 'pens', desc: 'Quatre couleurs pour écrire, corriger et souligner.' },
  { id: 'crayons-12', name: 'Boîte de 12 crayons de couleur', price: 6000, icon: 'pencils', desc: 'Douze couleurs pour dessiner et colorier.' },
  { id: 'trousse', name: 'Trousse scolaire zippée', price: 4000, icon: 'case', desc: 'Une trousse à fermeture zippée pour garder ses fournitures ensemble.' },
  { id: 'regle-30', name: 'Règle transparente 30 cm', price: 1000, icon: 'ruler', desc: 'Une règle transparente de 30 cm pour tracer avec précision.' },
  { id: 'gomme', name: 'Gomme blanche de précision', price: 800, icon: 'eraser', desc: 'Une gomme blanche pour effacer proprement.' },
  { id: 'ciseaux', name: 'Paire de ciseaux scolaires à bouts ronds', price: 2000, icon: 'scissors', desc: 'Des ciseaux à bouts ronds adaptés à l\u2019usage scolaire.' },
  { id: 'compas', name: "Compas d'écolier en métal", price: 4500, icon: 'compass', desc: 'Un compas en métal pour les tracés géométriques.' },
  { id: 'colle-stick', name: 'Colle en stick 21g', price: 1500, icon: 'glue', desc: 'Une colle en stick de 21 g, simple à appliquer.' },
  { id: 'classeur', name: 'Classeur rigide à anneaux dos 4 cm', price: 5000, icon: 'binder', desc: 'Un classeur rigide à anneaux, dos de 4 cm.' },
  { id: 'feuilles-100', name: 'Paquet de 100 feuilles mobiles grand carreaux (Seyes)', price: 3000, icon: 'sheets', desc: 'Cent feuilles mobiles Seyes à grands carreaux.' },
  { id: 'surligneur', name: 'Surligneur fluorescent (jaune, vert ou rose)', price: 1200, icon: 'marker', desc: 'Un surligneur fluorescent en jaune, vert ou rose.' }
];
const PROMO_TEXT = "Offre spéciale : une boîte d'agrafes offerte pour l'achat simultané d'une agrafeuse et d'une désagrafeuse !";

/* ===== État ===== */
let cart = {}; // { productId: quantité entière > 0 }
let lastFocus = null;
const $ = (id) => document.getElementById(id);
const getProduct = (id) => PRODUCTS.find((p) => p.id === id);

/* ===== Utilitaires ===== */
/** Formate un montant : 15 000 Ar (espace insécable, convention française). */
function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount).replace(/[\u202f\u00a0]/g, ' ') + ' Ar';
}
function toast(text) {
  const t = $('toast'); t.textContent = text; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2200);
}
function openWhatsApp(text) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const w = window.open(url, '_blank', 'noopener,noreferrer');
  if (!w) window.location.href = url; // popup bloquée : navigation directe
}

/* ===== Catalogue ===== */
function renderProducts() {
  const grid = $('productGrid');
  grid.innerHTML = ''; // contenu du catalogue de confiance, défini dans ce fichier
  PRODUCTS.forEach((p) => {
    const art = document.createElement('article');
    art.className = 'card product';
    const priced = p.price !== null;
    art.innerHTML = `${p.promo ? '<span class="badge">Boîte d\u2019agrafes offerte*</span>' : ''}
      <div class="thumb">${p.image ? `<img src="${p.image}" alt="${p.name}" loading="lazy" width="400" height="300">` : ''}<svg viewBox="0 0 120 90" role="img" aria-label="Illustration : ${p.name}" ${p.image ? 'hidden' : ''}>${ICONS[p.icon]}</svg></div>
      <div class="pbody"><h3>${p.name}</h3><p>${p.desc}</p>
      <div class="price ${priced ? '' : 'ask'}">${priced ? formatPrice(p.price) : 'Prix sur demande'}</div>
      ${p.stock ? `<span class="stock">${p.stock}</span>` : ''}
      ${p.promo ? '<p><small>*Pour l\u2019achat simultané d\u2019une agrafeuse et d\u2019une désagrafeuse.</small></p>' : ''}
      <button class="btn ${priced ? 'btn-accent' : 'btn-primary'}" type="button" data-id="${p.id}" data-act="${priced ? 'add' : 'ask'}">${priced ? 'Ajouter au panier' : 'Demander le prix sur WhatsApp'}</button></div>`;
    const img = art.querySelector('img');
    if (img) img.addEventListener('error', () => { img.hidden = true; art.querySelector('svg').hidden = false; }); // image de secours
    grid.appendChild(art);
  });
}

/* ===== Logique du panier ===== */
function addToCart(id) {
  const p = getProduct(id);
  if (!p || p.price === null) return;
  cart[id] = (cart[id] || 0) + 1;
  afterChange(true); toast(`${p.name} ajouté au panier`);
}
function updateQuantity(id, qty) {
  if (!getProduct(id)) return;
  if (!Number.isInteger(qty) || qty < 1) return removeFromCart(id);
  cart[id] = Math.min(qty, 999); afterChange(true);
}
function removeFromCart(id) { delete cart[id]; afterChange(false); }
function cartEntries() { return Object.entries(cart).map(([id, qty]) => ({ p: getProduct(id), qty })); }
function calculateSubtotal() { return cartEntries().reduce((s, { p, qty }) => s + p.price * qty, 0); }
function totalUnits() { return Object.values(cart).reduce((a, b) => a + b, 0); }
/** Offre : au moins une agrafeuse ET une désagrafeuse. Recalculée à chaque rendu. */
function isPromotionEligible() { return (cart.agrafeuse || 0) > 0 && (cart.desagrafeuse || 0) > 0; }
function afterChange(bump) { saveCart(); renderCart(); updateCartCounter(bump); }

/* ===== Persistance ===== */
function saveCart() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* stockage indisponible : on continue */ } }
/** Restaure et valide : ids connus, produits à prix fixe, entiers > 0. */
function loadCart() {
  cart = {};
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      Object.entries(data).forEach(([id, qty]) => {
        const p = getProduct(id);
        if (p && p.price !== null && Number.isInteger(qty) && qty > 0) cart[id] = Math.min(qty, 999);
      });
    }
  } catch (e) { cart = {}; }
}

/* ===== Rendu du panier ===== */
function updateCartCounter(bump) {
  const c = $('cartCount'); c.textContent = totalUnits();
  if (bump) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
}
function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text !== undefined) e.textContent = text; return e; }
function renderCart() {
  const body = $('cartBody'), sum = $('cartSummary'), entries = cartEntries();
  body.replaceChildren(); sum.replaceChildren(); $('cartMsg').textContent = '';
  $('checkoutBtn').disabled = entries.length === 0;
  if (!entries.length) { body.appendChild(el('p', 'empty', 'Votre panier est vide. Ajoutez un produit pour commencer.')); return; }
  entries.forEach(({ p, qty }) => {
    const line = el('div', 'line');
    const top = el('div', 'line-top'); top.append(el('span', '', p.name), el('span', '', formatPrice(p.price * qty)));
    const unit = el('small', '', `${formatPrice(p.price)} × ${qty}`);
    const q = el('div', 'qty');
    const mk = (label, txt, fn, cls) => { const b = el('button', cls, txt); b.type = 'button'; b.setAttribute('aria-label', label); b.addEventListener('click', fn); return b; };
    const out = el('output', '', String(qty));
    q.append(mk(`Diminuer la quantité de ${p.name}`, '−', () => updateQuantity(p.id, qty - 1)), out,
      mk(`Augmenter la quantité de ${p.name}`, '+', () => updateQuantity(p.id, qty + 1)),
      mk(`Supprimer ${p.name}`, 'Supprimer', () => removeFromCart(p.id), 'del'));
    line.append(top, unit, q); body.appendChild(line);
  });
  const row = (a, b, cls) => { const r = el('div', 'sum ' + (cls || '')); r.append(el('span', '', a), el('span', '', b)); return r; };
  const total = calculateSubtotal();
  sum.append(row('Articles', String(totalUnits())), row('Total des produits', formatPrice(total)));
  if (isPromotionEligible()) sum.appendChild(el('div', 'gift', "Félicitations ! Une boîte d'agrafes vous est offerte avec cette combinaison."));
  sum.append(row('Livraison', 'à confirmer'), row('Total provisoire hors livraison', formatPrice(total), 'total'));
}

/* ===== WhatsApp ===== */
function generateWhatsAppMessage() {
  const lines = ['Bonjour Mihaja Fournitures !', '', 'Je souhaite passer une commande.', '', '*Récapitulatif de ma commande :*'];
  cartEntries().forEach(({ p, qty }) => lines.push(`- ${p.name} × ${qty} : ${formatPrice(p.price * qty)}`));
  lines.push('', `*Total des produits : ${formatPrice(calculateSubtotal())}*`);
  if (isPromotionEligible()) lines.push('', '*Promotion :* une boîte d\'agrafes offerte.');
  lines.push('', '*Livraison :* à convenir.', '*Mode de récupération :* à préciser.', '',
    'Merci de me confirmer la disponibilité des produits ainsi que les frais et modalités de livraison.');
  return lines.join('\n');
}
function checkoutWhatsApp() {
  const msg = $('cartMsg');
  if (!Object.keys(cart).length) { msg.textContent = 'Votre panier est vide : ajoutez au moins un produit.'; return; }
  const valid = cartEntries().every(({ p, qty }) => p && p.price !== null && Number.isInteger(qty) && qty > 0);
  if (!valid) { msg.textContent = 'Le panier contient des données incohérentes. Vérifiez vos articles.'; return; }
  openWhatsApp(generateWhatsAppMessage());
  toast("WhatsApp s'ouvre : envoyez le message pour finaliser.");
}
function requestProductPrice(id) {
  const p = getProduct(id);
  const text = `Bonjour Mihaja Fournitures ! Pourriez-vous m'indiquer le prix et la disponibilité de : ${p.name} ?`;
  openWhatsApp(text);
}

/* ===== Panier : panneau modal accessible ===== */
function openDrawer() {
  lastFocus = document.activeElement;
  $('drawer').classList.add('open'); $('drawer').setAttribute('aria-hidden', 'false'); $('overlay').hidden = false;
  document.body.style.overflow = 'hidden'; $('cartClose').focus();
}
function closeDrawer() {
  $('drawer').classList.remove('open'); $('drawer').setAttribute('aria-hidden', 'true'); $('overlay').hidden = true;
  document.body.style.overflow = ''; if (lastFocus) lastFocus.focus();
}
function setMenu(open) {
  $('menu').classList.toggle('open', open);
  $('burger').setAttribute('aria-expanded', String(open));
  $('burger').setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
}

/* ===== Initialisation ===== */
document.addEventListener('DOMContentLoaded', () => {
  $('year').textContent = new Date().getFullYear();
  renderProducts(); loadCart(); renderCart(); updateCartCounter(false);
  $('productGrid').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-id]'); if (!b) return;
    b.dataset.act === 'add' ? addToCart(b.dataset.id) : requestProductPrice(b.dataset.id);
  });
  $('cartOpen').addEventListener('click', openDrawer);
  $('cartClose').addEventListener('click', closeDrawer);
  $('continueBtn').addEventListener('click', () => { closeDrawer(); $('produits').scrollIntoView(); });
  $('overlay').addEventListener('click', closeDrawer);
  $('checkoutBtn').addEventListener('click', checkoutWhatsApp);
  $('deliveryBtn').addEventListener('click', () => openWhatsApp("Bonjour Mihaja Fournitures ! Je souhaite organiser la livraison (ou la récupération en ville) de ma commande. Pouvez-vous m'indiquer les modalités, les frais et les délais ?"));
  $('burger').addEventListener('click', () => setMenu(!$('menu').classList.contains('open')));
  $('menu').addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if ($('drawer').classList.contains('open')) closeDrawer(); else setMenu(false); }
    if (e.key === 'Tab' && $('drawer').classList.contains('open')) { // piège à focus
      const f = [...$('drawer').querySelectorAll('button:not([disabled])')];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
});

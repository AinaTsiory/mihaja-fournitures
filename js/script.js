'use strict';
/* ===== Configuration (modifiable) ===== */
const WHATSAPP_NUMBER = '261345521919';
const STORAGE_KEY = 'mihaja-cart-v1';
const ICONS = {
  stapler: '<path d="M3 16h18v3H3zM5 16l-1-5 15-4 1 4"/>',
  remover: '<path d="M4 17h16M6 17l6-8 6 8M9 12l-4-3"/>',
  cutter: '<path d="M4 15l10-10 6 6-10 10zM9 10l5 5"/>',
  pad: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M7 11h10M7 15h6"/>',
  box: '<path d="M3 8l9-4 9 4v9l-9 4-9-4zM3 8l9 4 9-4M12 12v9"/>'
};
// price: nombre entier en Ariary, ou null = sur demande (jamais ajouté au panier)
const PRODUCTS = [
  { id: 'agrafeuse', name: 'Agrafeuse de bureau', price: 10000, icon: 'stapler', promo: true,
    desc: "Un indispensable pour assembler et organiser facilement vos documents." },
  { id: 'desagrafeuse', name: 'Désagrafeuse', price: 5000, icon: 'remover', promo: true,
    desc: 'Retirez rapidement les agrafes de vos documents.' },
  { id: 'cutter', name: 'Cutter / Massicot de poche', price: 5000, icon: 'cutter',
    desc: "Un outil pratique pour découper le papier, le carton et les matériaux fins, avec les précautions d'utilisation nécessaires." },
  { id: 'sous-main', name: 'Sous-main de bureau', price: null, icon: 'pad', stock: 'Disponible à la commande',
    action: 'Demander le prix sur WhatsApp',
    desc: 'Un accessoire pratique pour aménager votre bureau et créer un espace de travail confortable.' },
  { id: 'divers', name: 'Divers articles de bureau', price: null, icon: 'box', action: 'Demander des informations',
    desc: 'Découvrez d\u2019autres articles pour organiser et équiper votre espace de travail.' }
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
      <div class="thumb"><svg viewBox="0 0 24 24" role="img" aria-label="Illustration : ${p.name}">${ICONS[p.icon]}</svg></div>
      <div class="pbody"><h3>${p.name}</h3><p>${p.desc}</p>
      <div class="price ${priced ? '' : 'ask'}">${priced ? formatPrice(p.price) : 'Prix sur demande'}</div>
      ${p.stock ? `<span class="stock">${p.stock}</span>` : ''}
      ${p.promo ? '<p><small>*Pour l\u2019achat simultané d\u2019une agrafeuse et d\u2019une désagrafeuse.</small></p>' : ''}
      <button class="btn ${priced ? 'btn-accent' : 'btn-primary'}" type="button" data-id="${p.id}" data-act="${priced ? 'add' : 'ask'}">${priced ? 'Ajouter au panier' : p.action}</button></div>`;
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
  const text = id === 'divers'
    ? 'Bonjour Mihaja Fournitures ! Je souhaite des informations sur vos autres articles de bureau. Pouvez-vous m\'indiquer ce qui est disponible et les prix ?'
    : `Bonjour Mihaja Fournitures ! Pourriez-vous m'indiquer le prix et la disponibilité de : ${p.name} ?`;
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

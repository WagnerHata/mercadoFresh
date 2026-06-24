/* ─── DADOS ─── */
const products = [
  { id:1, emoji:'🍎', name:'Maçã Fuji', unit:'kg', price:8.90, old:11.90, cat:'frutas', discount:25 },
  { id:2, emoji:'🥦', name:'Brócolis', unit:'unidade', price:4.50, old:null, cat:'legumes' },
  { id:3, emoji:'🥛', name:'Leite Integral', unit:'1L', price:5.99, old:7.49, cat:'laticinios', discount:20 },
  { id:4, emoji:'🍅', name:'Tomate Cereja', unit:'bandeja 300g', price:6.90, old:null, cat:'legumes' },
  { id:5, emoji:'🧀', name:'Queijo Minas', unit:'300g', price:12.90, old:15.90, cat:'laticinios', discount:19 },
  { id:6, emoji:'🍌', name:'Banana Nanica', unit:'kg', price:3.49, old:null, cat:'frutas' },
  { id:7, emoji:'🥩', name:'Fraldinha', unit:'kg', price:42.90, old:49.90, cat:'carnes', discount:14 },
  { id:8, emoji:'🍞', name:'Pão de Forma', unit:'500g', price:7.49, old:null, cat:'padaria' },
];

const featured = [
  { id:101, emoji:'🥗', tag:'Cesta Vegana', name:'Cesta Hortifruti Semanal', desc:'Seleção fresquinha de frutas e verduras orgânicas para a semana toda.', price:89.90 },
  { id:102, emoji:'🥩', tag:'Combo Churrasco', name:'Kit Churrasco Completo', desc:'Picanha, linguiça, fraldinha e carvão. Tudo para um churrasco perfeito!', price:129.90 },
  { id:103, emoji:'🥐', tag:'Café da Manhã', name:'Cesta Café da Manhã', desc:'Pão, queijo, presunto, ovos, iogurte e suco. O café perfeito em casa.', price:59.90 },
];

/* ─── CARRINHO ─── */
let cart = {};

function addToCart(id) {
  const p = products.find(x => x.id === id) || featured.find(x => x.id === id);
  if (!p) return;
  if (cart[id]) cart[id].qty++;
  else cart[id] = { ...p, qty: 1 };
  updateCartUI();
  showToast(`${p.emoji} ${p.name} adicionado!`);
}

function changeQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) delete cart[id];
  updateCartUI();
}

function updateCartUI() {
  const total = Object.values(cart).reduce((s,i) => s + i.price * i.qty, 0);
  const count = Object.values(cart).reduce((s,i) => s + i.qty, 0);

  document.getElementById('cartBadge').textContent = count;
  document.getElementById('cartTotal').textContent = 'R$ ' + total.toFixed(2).replace('.',',');

  const container = document.getElementById('cartItems');
  if (!count) {
    container.innerHTML = `<div class="cart-empty"><div class="empty-emoji">🛒</div><p>Seu carrinho está vazio.<br>Adicione produtos para começar!</p></div>`;
    return;
  }
  container.innerHTML = Object.values(cart).map(i => `
    <div class="cart-item">
      <div class="cart-item-emoji">${i.emoji}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">R$ ${(i.price * i.qty).toFixed(2).replace('.',',')}</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty(${i.id},-1)">−</button>
        <span class="qty-num">${i.qty}</span>
        <button class="qty-btn" onclick="changeQty(${i.id},1)">+</button>
      </div>
    </div>
  `).join('');
}

/* ─── RENDER PRODUCTS ─── */
function renderProducts(list) {
  document.getElementById('productGrid').innerHTML = list.map(p => `
    <div class="product-card" onclick="addToCart(${p.id})">
      ${p.discount ? `<span class="discount-badge">−${p.discount}%</span>` : ''}
      <div class="product-img">${p.emoji}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-unit">Por ${p.unit}</div>
      <div class="product-price">
        R$ ${p.price.toFixed(2).replace('.',',')}
        ${p.old ? `<span class="old">R$ ${p.old.toFixed(2).replace('.',',')}</span>` : ''}
      </div>
      <button class="add-btn" onclick="event.stopPropagation();addToCart(${p.id})">+</button>
    </div>
  `).join('');
}

function renderFeatured() {
  document.getElementById('featuredGrid').innerHTML = featured.map(f => `
    <div class="featured-card">
      <div class="featured-img">${f.emoji}</div>
      <div class="featured-body">
        <div class="featured-tag">${f.tag}</div>
        <div class="featured-name">${f.name}</div>
        <div class="featured-desc">${f.desc}</div>
        <div class="featured-footer">
          <span class="featured-price">R$ ${f.price.toFixed(2).replace('.',',')}</span>
          <button class="featured-add" onclick="addToCart(${f.id})">+ Adicionar</button>
        </div>
      </div>
    </div>
  `).join('');
}

/* ─── FILTER ─── */
function filterChip(el, cat) {
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderProducts(cat === 'todos' ? products : products.filter(p => p.cat === cat));
}

/* ─── SEARCH ─── */
function doSearch() {
  const q = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!q) { renderProducts(products); return; }
  const res = products.filter(p => p.name.toLowerCase().includes(q));
  renderProducts(res.length ? res : []);
  if (!res.length) showToast('Nenhum produto encontrado!');
}
document.getElementById('searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

/* ─── CART TOGGLE ─── */
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

/* ─── TOAST ─── */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ─── INIT ─── */
renderProducts(products);
renderFeatured();
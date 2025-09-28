// js/script.js
// Simple demo e-commerce logic using localStorage (no server required).
const state = {
  products: [],
  cart: [],
  orders: [],
  user: null,
  coupons: { 'WELCOME10': 0.10 }
};

function saveState(){
  localStorage.setItem('ts_products', JSON.stringify(state.products));
  localStorage.setItem('ts_cart', JSON.stringify(state.cart));
  localStorage.setItem('ts_orders', JSON.stringify(state.orders));
}
function loadState(){
  state.products = JSON.parse(localStorage.getItem('ts_products')||'[]');
  state.cart = JSON.parse(localStorage.getItem('ts_cart')||'[]');
  state.orders = JSON.parse(localStorage.getItem('ts_orders')||'[]');
}
loadState();

// Helpers
function genId(){ return Math.random().toString(36).slice(2,9); }

// Seed sample products (only if none exist)
function seedProducts(){
  if(state.products.length) return;
  state.products = [
    { id: genId(), title: 'Minimal Logo Tee', price: 499, img: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#fff'/><text x='50%' y='50%' font-size='36' text-anchor='middle' dominant-baseline='middle' fill='#0b6cf6'>Minimal Logo</text></svg>`) },
    { id: genId(), title: 'Retro Wave Tee', price: 699, img: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#fff'/><text x='50%' y='50%' font-size='36' text-anchor='middle' dominant-baseline='middle' fill='#ef4444'>Retro Wave</text></svg>`) },
    { id: genId(), title: 'Nature Print', price: 799, img: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='#fff'/><text x='50%' y='50%' font-size='36' text-anchor='middle' dominant-baseline='middle' fill='#10b981'>Nature</text></svg>`) }
  ];
  saveState();
}

// Render functions (used in index/shop/product pages)
function renderFeatured(){
  const el = document.getElementById('featured');
  if(!el) return;
  el.innerHTML = '';
  (state.products.slice(0,3)).forEach(p => {
    const d = document.createElement('div'); d.className='product-card card';
    d.innerHTML = `<img src="${p.img}" /><div style="padding:8px"><strong>${p.title}</strong><div class="muted">₹${p.price}</div><div style="margin-top:8px"><a class="btn" href="product.html?id=${p.id}">View</a> <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button></div></div>`;
    el.appendChild(d);
  });
}

function renderProductsGrid(){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  grid.innerHTML = '';
  state.products.forEach(p => {
    const d = document.createElement('div'); d.className='product-card card';
    d.innerHTML = `<img src="${p.img}" /><div style="padding:8px"><strong>${p.title}</strong><div class="muted">₹${p.price}</div><div style="margin-top:8px"><a class="btn" href="product.html?id=${p.id}">View</a> <button class="btn" onclick="addToCart('${p.id}')">Add to Cart</button></div></div>`;
    grid.appendChild(d);
  });
}

function showProductPage(){
  const id = new URLSearchParams(location.search).get('id');
  if(!id) return;
  const p = state.products.find(x=>x.id===id);
  const el = document.getElementById('productCard');
  if(!el || !p) return;
  el.innerHTML = `<div style="display:flex;gap:16px"><img src="${p.img}" style="width:320px;height:auto;border-radius:8px" /><div><h2>${p.title}</h2><div class="muted">₹${p.price}</div>
  <div style="margin-top:12px"><label>Size</label><select id="sizeSel"><option>S</option><option>M</option><option>L</option></select></div>
  <div style="margin-top:12px"><button class="primary" onclick="buyNow('${p.id}')">Buy Now</button> <button onclick="addToCart('${p.id}')">Add to Cart</button></div></div></div>`;
}

// Cart functions
function addToCart(productId){
  const p = state.products.find(x=>x.id===productId);
  if(!p) return alert('Product not found');
  state.cart.push({ cartId: genId(), id: p.id, title: p.title, price: p.price, img: p.img, qty: 1 });
  saveState(); renderCartPreview(); updateCartCount();
  alert('Added to cart');
}
function buyNow(productId){
  addToCart(productId);
  location.href = 'cart.html';
}
function renderCartPreview(){
  // small preview used in many pages
  const elIds = ['cartCountHome','cartCountShop','cartCountDesigner','cartCountProduct'];
  elIds.forEach(id=>{ const e=document.getElementById(id); if(e) e.innerText = state.cart.length; });
}
function renderCartList(){
  const el = document.getElementById('cartList');
  if(!el) return;
  el.innerHTML = '';
  if(state.cart.length===0) { el.innerHTML = '<div class="muted">Your cart is empty.</div>'; return; }
  state.cart.forEach(item=>{
    const row = document.createElement('div'); row.className = 'card'; row.style.display='flex'; row.style.gap='12px'; row.style.alignItems='center';
    row.innerHTML = `<img src="${item.img}" style="width:80px;height:80px;object-fit:cover;border-radius:8px"/><div style="flex:1"><strong>${item.title}</strong><div class="muted">₹${item.price}</div></div><div><button onclick="removeFromCart('${item.cartId}')" class="small">Remove</button></div>`;
    el.appendChild(row);
  });
  const total = state.cart.reduce((s,i)=>s + (i.price * (i.qty||1)), 0);
  const totDiv = document.createElement('div'); totDiv.className='card'; totDiv.innerHTML = `<strong>Total: ₹${total}</strong>`;
  el.appendChild(totDiv);
}
function removeFromCart(cartId){
  state.cart = state.cart.filter(i=>i.cartId !== cartId); saveState(); renderCartList(); renderCartPreview(); updateCartCount();
}
function updateCartCount(){
  document.querySelectorAll('#cartCountHome, #cartCountShop, #cartCountDesigner, #cartCountProduct').forEach(el=>el && (el.innerText = state.cart.length));
}

// Checkout (demo)
function checkout(){
  if(state.cart.length === 0) return alert('Cart empty');
  const user = prompt('Enter your email for order (demo):');
  if(!user) return;
  const order = { id: 'ORD' + Date.now(), user, items: state.cart, total: state.cart.reduce((s,i)=>s + i.price,0), date: new Date().toISOString() };
  state.orders.push(order);
  state.cart = [];
  saveState();
  renderCartList();
  renderCartPreview();
  updateCartCount();
  alert('Order placed (demo). Order id: ' + order.id);
}

// Coupons
function applyCoupon(){ const code = document.getElementById('coupon')?.value?.trim().toUpperCase(); if(!code) return alert('Enter code'); const v = state.coupons[code]; if(!v) return alert('Invalid'); alert('Coupon applied: ' + code + ' (' + (v*100) + '%)'); }

// Admin: add product (client side)
function adminAddProduct(){
  const title = document.getElementById('prodTitle').value; const price = parseFloat(document.getElementById('prodPrice').value||0); const file = document.getElementById('prodImg').files[0];
  if(!title || !price || !file) return alert('Provide title, price and image');
  const reader = new FileReader(); reader.onload = e => {
    state.products.push({ id: genId(), title, price, img: e.target.result });
    saveState(); alert('Product added'); renderProductsGrid(); renderFeatured(); renderCartPreview();
  }; reader.readAsDataURL(file);
}
function renderAdminOrders(){
  const el = document.getElementById('adminOrders'); if(!el) return; el.innerHTML = '';
  state.orders.forEach(o => {
    const d = document.createElement('div'); d.className = 'card'; d.innerHTML = `<div>Order ${o.id} — ${o.user} — ₹${o.total}</div><div class="muted">${new Date(o.date).toLocaleString()}</div>`;
    el.appendChild(d);
  });
}

// Boot on each page
document.addEventListener('DOMContentLoaded', ()=>{
  seedProducts();
  renderFeatured();
  renderProductsGrid();
  renderCartPreview();
  updateCartCount();

  // Product page
  if(document.getElementById('productCard')) showProductPage();

  // Shop page render
  if(document.getElementById('productsGrid')) renderProductsGrid();

  // Cart page
  if(document.getElementById('cartList')) renderCartList();

  // Admin events
  const addBtn = document.getElementById('addProduct'); if(addBtn) addBtn.addEventListener('click', adminAddProduct);
  const seedBtn = document.getElementById('seedProducts'); if(seedBtn) seedBtn.addEventListener('click', ()=>{ seedProducts(); renderProductsGrid(); alert('Seeded products'); });

  // Checkout/coupon handlers on cart page
  const checkoutBtn = document.getElementById('checkoutBtn'); if(checkoutBtn) checkoutBtn.addEventListener('click', checkout);
  const applyCp = document.getElementById('applyCoupon'); if(applyCp) applyCp.addEventListener('click', applyCoupon);
});

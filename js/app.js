/* State */
const state = {
  products: [
    { id: 's1', title: "Classic Leather Oxfords", category: 'Official', price: 6999, sku: 'OXF-CL1', image: 'https://source.unsplash.com/featured/400x300?oxford-shoes&sig=1' },
    { id: 's2', title: "Premium Derby Shoes", category: 'Official', price: 7499, sku: 'DER-PM1', image: 'https://source.unsplash.com/featured/400x300?derby-shoes&sig=2' },
    { id: 's3', title: "Canvas Low-top Sneakers", category: 'Sneakers', price: 3499, sku: 'SNK-CV1', image: 'https://source.unsplash.com/featured/400x300?canvas-sneakers&sig=3' },
    { id: 's4', title: "Air Mesh Running Sneakers", category: 'Sport', price: 4599, sku: 'RUN-AM1', image: 'https://source.unsplash.com/featured/400x300?running-shoes&sig=4' },
    { id: 's5', title: "High-top Street Sneakers", category: 'Sneakers', price: 3999, sku: 'SNK-HT1', image: 'https://source.unsplash.com/featured/400x300?high-top-sneakers&sig=5' },
    { id: 's6', title: "Studded Football Boots", category: 'Sport', price: 5799, sku: 'SPT-FB1', image: 'https://source.unsplash.com/featured/400x300?football-boots&sig=6' },
    { id: 'o1', title: "Leather Open Sandals", category: 'Open Shoes', price: 2599, sku: 'OPN-LS1', image: 'https://source.unsplash.com/featured/400x300?men-leather-sandals&sig=7' },
    { id: 'o2', title: "Casual Slide Sandals", category: 'Open Shoes', price: 1899, sku: 'OPN-SL1', image: 'https://source.unsplash.com/featured/400x300?men-slide-sandals&sig=8' },
    { id: 'o3', title: "Beach Flip Flops", category: 'Open Shoes', price: 999, sku: 'OPN-FF1', image: 'https://source.unsplash.com/featured/400x300?men-flip-flops&sig=9' },
    { id: 'o4', title: "Sporty Open Sandals", category: 'Open Shoes', price: 2199, sku: 'OPN-SP1', image: 'https://source.unsplash.com/featured/400x300?sport-sandals-men&sig=10' }
  ],
  user: null,
  cart: []
};

/* Elements */
const productsGrid = document.getElementById('products-grid');
const shopSection = document.getElementById('shop-section');
const homeSection = document.getElementById('home-section');
const registerSection = document.getElementById('register-section');
// About and Contact are now inside the Shop section as blocks
const openShopBtn = document.getElementById('open-shop');
const openHomeBtn = document.getElementById('open-home');
const openRegisterBtn = document.getElementById('open-register');
const openAboutBtn = document.getElementById('open-about');
const openContactBtn = document.getElementById('open-contact');
const cartBtn = document.getElementById('open-cart');
const cartDrawer = document.getElementById('cart-drawer');
const closeCartBtn = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItemsEl = document.getElementById('cart-items');
const cartCountEl = document.getElementById('cart-count');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const registerForm = document.getElementById('register-form');
const ctaShopBtn = document.getElementById('cta-shop');
const registerSuccess = document.getElementById('register-success');

const checkoutDialog = document.getElementById('checkout-dialog');
const closeCheckout = document.getElementById('close-checkout');
const payNowBtn = document.getElementById('pay-now');
const paymentStatus = document.getElementById('payment-status');
const stkWait = document.getElementById('stk-wait');
const mpesaFields = document.getElementById('mpesa-fields');
const cardFields = document.getElementById('card-fields');
const checkoutItemsCount = document.getElementById('checkout-items-count');
const checkoutTotal = document.getElementById('checkout-total');
const mpesaPhoneInput = document.getElementById('mpesaPhone');

/* Utils */
const fmt = (amt) => `KSh ${amt.toLocaleString('en-KE')}`;
const save = () => {
  localStorage.setItem('njerus_user', JSON.stringify(state.user));
  localStorage.setItem('njerus_cart', JSON.stringify(state.cart));
};
const load = () => {
  try {
    const user = JSON.parse(localStorage.getItem('njerus_user'));
    const cart = JSON.parse(localStorage.getItem('njerus_cart'));
    state.user = user || null;
    state.cart = Array.isArray(cart) ? cart : [];
  } catch (_) {}
};

/* Navigation */
function showSection(section) {
  for (const el of [homeSection, shopSection, registerSection]) el.classList.remove('active');
  section.classList.add('active');
}

openHomeBtn.addEventListener('click', () => showSection(homeSection));
openShopBtn.addEventListener('click', () => showSection(shopSection));
openAboutBtn.addEventListener('click', () => {
  showSection(shopSection);
  const el = document.getElementById('about-block');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
openContactBtn.addEventListener('click', () => {
  showSection(shopSection);
  const el = document.getElementById('contact-block');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
openRegisterBtn.addEventListener('click', () => showSection(registerSection));
if (ctaShopBtn) ctaShopBtn.addEventListener('click', () => showSection(shopSection));

/* Products */
function renderProducts() {
  productsGrid.innerHTML = '';
  state.products.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'card product';
    const localSrc = `assets/shoes/${p.id}.jpg`;
    card.innerHTML = `
      <div class="image"><img src="${localSrc}" alt="${p.title}" loading="lazy" onerror="this.onerror=null; this.src='${p.image}';" /></div>
      <div class="title">${p.title}</div>
      <div class="hint">${p.category}</div>
      <div class="price">${fmt(p.price)}</div>
      <div class="actions">
        <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  productsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    const id = btn.getAttribute('data-add');
    addToCart(id, 1);
  }, { once: true });
}

/* Cart */
function addToCart(productId, qty) {
  const product = state.products.find(p => p.id === productId);
  if (!product) return;
  const existing = state.cart.find(i => i.id === productId);
  if (existing) existing.qty += qty;
  else state.cart.push({ id: productId, qty });
  save();
  renderCart();
  openCart();
  showToast(`Added ${product.title} • ${fmt(product.price * qty)}`);
}

function updateQty(productId, qty) {
  const item = state.cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = Math.max(1, qty);
  save();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter(i => i.id !== productId);
  save();
  renderCart();
}

function cartTotals() {
  let total = 0; let count = 0;
  for (const item of state.cart) {
    const p = state.products.find(pp => pp.id === item.id);
    if (!p) continue;
    total += p.price * item.qty;
    count += item.qty;
  }
  return { total, count };
}

function renderCart() {
  cartItemsEl.innerHTML = '';
  const { total, count } = cartTotals();
  cartCountEl.textContent = String(count);
  cartTotalEl.textContent = fmt(total);
  checkoutBtn.disabled = state.cart.length === 0;

  for (const item of state.cart) {
    const p = state.products.find(pp => pp.id === item.id);
    if (!p) continue;
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="thumb">${p.title.split(' ').map(w => w[0]).join('')}</div>
      <div class="meta">
        <div class="title">${p.title}</div>
        <div class="price">${fmt(p.price)}</div>
        <div class="qty">
          <button class="btn" data-dec="${p.id}">-</button>
          <input type="number" min="1" value="${item.qty}" data-qty="${p.id}" />
          <button class="btn" data-inc="${p.id}">+</button>
        </div>
      </div>
      <div class="actions">
        <button class="btn" data-remove="${p.id}">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  }

  cartItemsEl.onclick = (e) => {
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (t.hasAttribute('data-inc')) {
      const id = t.getAttribute('data-inc');
      const it = state.cart.find(i => i.id === id);
      if (it) updateQty(id, it.qty + 1);
    } else if (t.hasAttribute('data-dec')) {
      const id = t.getAttribute('data-dec');
      const it = state.cart.find(i => i.id === id);
      if (it) updateQty(id, Math.max(1, it.qty - 1));
    } else if (t.hasAttribute('data-remove')) {
      removeFromCart(t.getAttribute('data-remove'));
    }
  };

  cartItemsEl.oninput = (e) => {
    const t = e.target;
    if (!(t instanceof HTMLInputElement) || !t.hasAttribute('data-qty')) return;
    const id = t.getAttribute('data-qty');
    const val = parseInt(t.value || '1', 10);
    if (!Number.isNaN(val)) updateQty(id, val);
  };
}

function openCart() {
  cartDrawer.classList.add('open');
  cartDrawer.setAttribute('aria-hidden', 'false');
  overlay.hidden = false;
}
function closeCart() {
  cartDrawer.classList.remove('open');
  cartDrawer.setAttribute('aria-hidden', 'true');
  overlay.hidden = true;
}

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);

/* Registration */
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(registerForm);
  const fullName = String(data.get('fullName') || '').trim();
  const email = String(data.get('email') || '').trim();
  const phone = String(data.get('phone') || '').trim();
  const password = String(data.get('password') || '');

  if (!fullName || !email || !phone || password.length < 6) return;
  state.user = { fullName, email, phone, createdAt: new Date().toISOString() };
  save();
  registerSuccess.hidden = false;
  setTimeout(() => { registerSuccess.hidden = true; showSection(shopSection); }, 1200);
});

/* Checkout */
checkoutBtn.addEventListener('click', () => {
  if (!state.user) {
    showSection(registerSection);
    return;
  }
  const { total, count } = cartTotals();
  checkoutItemsCount.textContent = String(count);
  checkoutTotal.textContent = fmt(total);
  mpesaPhoneInput.value = state.user?.phone || '';
  checkoutDialog.showModal();
});

closeCheckout.addEventListener('click', () => checkoutDialog.close());

document.addEventListener('change', (e) => {
  const t = e.target;
  if (!(t instanceof HTMLInputElement)) return;
  if (t.name === 'paymentMethod') {
    const method = t.value;
    if (method === 'mpesa') {
      mpesaFields.hidden = false; cardFields.hidden = true;
    } else {
      mpesaFields.hidden = true; cardFields.hidden = false;
    }
  }
});

payNowBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'mpesa';
  const { total } = cartTotals();
  if (total <= 0) return;

  if (method === 'mpesa') {
    const phone = mpesaPhoneInput.value.trim();
    if (!/^0[17]\d{8}$/.test(phone)) {
      showStatus('Enter a valid Mpesa phone number', true);
      return;
    }
    // Simulate Mpesa STK push
    startWaiting(`Sending STK push to ${maskPhone(phone)}...`);
    await sleep(1500);
    showStatus('MPESA prompt sent. Check your phone and enter your PIN to approve.', false);
    await sleep(2000);
    // Simulate success
    showStatus('Payment successful! Thank you.', false);
    stopWaiting();
    state.cart = [];
    save();
    renderCart();
    setTimeout(() => checkoutDialog.close(), 900);
  } else {
    startWaiting('Processing card payment...');
    await sleep(1500);
    showStatus('Payment successful! Thank you.', false);
    stopWaiting();
    state.cart = [];
    save();
    renderCart();
    setTimeout(() => checkoutDialog.close(), 900);
  }
});

function showStatus(msg, isError) {
  if (stkWait) stkWait.hidden = false;
  paymentStatus.hidden = false;
  paymentStatus.textContent = msg;
  paymentStatus.style.color = isError ? '#ef4444' : '#22c55e';
}

function sleep(ms) { return new Promise(res => setTimeout(res, ms)); }

function startWaiting(initialMsg) {
  if (payNowBtn) payNowBtn.disabled = true;
  showStatus(initialMsg, false);
}

function stopWaiting() {
  if (payNowBtn) payNowBtn.disabled = false;
  if (stkWait) stkWait.hidden = true;
}

function maskPhone(p) {
  if (p.length !== 10) return p;
  return p.slice(0,3) + '****' + p.slice(7);
}

// Toast
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.hidden = true; }, 1800);
}

/* Init */
load();
renderProducts();
renderCart();
if (state.user) {
  // Pre-fill register form
  registerForm.fullName.value = state.user.fullName;
  registerForm.email.value = state.user.email;
  registerForm.phone.value = state.user.phone;
}



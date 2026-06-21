/* ============================================
   WebStore Mockup — App Logic
   ============================================ */

// ─── PRODUCT DATA ──────────────────────────

const PRODUCTS = [
  {
    id: 'zelda-totk',
    code: 'ZEL-TOTK-001',
    name: 'The Legend of Zelda: Tears of the Kingdom',
    franchise: 'Zelda',
    platform: 'Nintendo Switch',
    price: 89999,
    description: 'Embárcate en una épica aventura por las tierras de Hyrule. Explora vastos cielos, profundidades misteriosas y un mundo expansivo lleno de maravillas.',
    image: 'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=600',
    images: [
      'https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=600',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600',
    ],
    variants: [
      { name: 'Edition', options: ['Standard', "Collector's Edition"] },
    ],
    stock: { 'Standard': 25, "Collector's Edition": 5 },
    featured: true,
  },
  {
    id: 'zelda-botw',
    code: 'ZEL-BOTW-001',
    name: 'The Legend of Zelda: Breath of the Wild',
    franchise: 'Zelda',
    platform: 'Nintendo Switch',
    price: 64999,
    description: 'Adéntrate en un mundo de descubrimiento, exploración y aventura. Olvidá todo lo que sabés sobre los juegos de Zelda.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600',
    images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600'],
    variants: [],
    stock: {},
    featured: false,
  },
  {
    id: 'mario-odyssey',
    code: 'MAR-ODYS-001',
    name: 'Super Mario Odyssey',
    franchise: 'Mario',
    platform: 'Nintendo Switch',
    price: 54999,
    description: 'Viajá entre mundos en esta aventura sandbox 3D de Mario.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600',
    images: ['https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600'],
    variants: [],
    stock: {},
    featured: true,
  },
  {
    id: 'mario-wonder',
    code: 'MAR-WONDER-001',
    name: 'Super Mario Bros. Wonder',
    franchise: 'Mario',
    platform: 'Nintendo Switch',
    price: 69999,
    description: 'Viví una nueva era de diversión con Mario y el poder de la flor Maravilla.',
    image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600',
    images: ['https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=600'],
    variants: [
      { name: 'Characters', options: ['Mario', 'Peach', 'Toad'] },
    ],
    stock: { 'Mario': 50, 'Peach': 30, 'Toad': 20 },
    featured: true,
  },
  {
    id: 'pokemon-scarlet',
    code: 'POK-SV-001',
    name: 'Pokémon Scarlet',
    franchise: 'Pokémon',
    platform: 'Nintendo Switch',
    price: 74999,
    description: 'Comenzá tu propia aventura Pokémon en la región de Paldea.',
    image: 'https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=600',
    images: ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?w=600'],
    variants: [
      { name: 'Version', options: ['Scarlet', 'Violet'] },
    ],
    stock: { 'Scarlet': 40, 'Violet': 40 },
    featured: true,
  },
  {
    id: 'metroid-dread',
    code: 'MET-DREAD-001',
    name: 'Metroid Dread',
    franchise: 'Metroid',
    platform: 'Nintendo Switch',
    price: 54999,
    description: 'Acompañá a Samus Aran en una misión a un planeta misterioso.',
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600',
    images: ['https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600'],
    variants: [],
    stock: {},
    featured: false,
  },
]

// ─── CART STATE ────────────────────────────

const CART_KEY = 'webstore-mockup-cart'
let cart = loadCart()

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || []
  } catch { return [] }
}

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
  updateCartUI()
}

function addToCart(productId, variantKey, quantity) {
  const key = variantKey ? `${productId}::${variantKey}` : productId
  const existing = cart.find(c => c.key === key)
  if (existing) {
    existing.quantity += quantity
  } else {
    const product = PRODUCTS.find(p => p.id === productId)
    cart.push({
      key,
      productId,
      variantKey: variantKey || null,
      name: product.name,
      variantName: variantKey || null,
      price: product.price,
      quantity,
      image: product.image,
    })
  }
  saveCart()
}

function removeFromCart(key) {
  cart = cart.filter(c => c.key !== key)
  saveCart()
}

function updateQuantity(key, qty) {
  if (qty <= 0) {
    removeFromCart(key)
    return
  }
  const item = cart.find(c => c.key === key)
  if (item) { item.quantity = qty; saveCart() }
}

function clearCart() {
  cart = []
  saveCart()
}

function cartCount() {
  return cart.reduce((sum, c) => sum + c.quantity, 0)
}

function cartSubtotal() {
  return cart.reduce((sum, c) => sum + c.price * c.quantity, 0)
}

// ─── CART UI ───────────────────────────────

function toggleCart() {
  document.getElementById('cart-panel').classList.toggle('open')
  document.getElementById('cart-overlay').classList.toggle('open')
  renderCartItems()
}

function updateCartUI() {
  const badge = document.getElementById('cart-badge')
  const count = cartCount()
  if (badge) {
    badge.textContent = count > 99 ? '99+' : count
    badge.classList.toggle('visible', count > 0)
  }
}

function renderCartItems() {
  const container = document.getElementById('cart-items')
  const totals = document.getElementById('cart-totals')
  const checkoutBtn = document.getElementById('btn-checkout')
  if (!container) return

  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Tu carrito está vacío</p></div>'
    if (totals) totals.innerHTML = ''
    if (checkoutBtn) checkoutBtn.style.display = 'none'
    return
  }

  if (checkoutBtn) checkoutBtn.style.display = ''

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2264%22><rect fill=%22%2312121a%22 width=%2264%22 height=%2264%22/></svg>'">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        ${item.variantName ? `<div class="cart-item-variant">${item.variantName}</div>` : ''}
        <div class="cart-item-qty">
          <button onclick="updateQuantity('${item.key}', ${item.quantity - 1})">−</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity('${item.key}', ${item.quantity + 1})">+</button>
        </div>
      </div>
      <div class="cart-item-price">$${formatPrice(item.price * item.quantity)}</div>
    </div>
  `).join('')

  const subtotal = cartSubtotal()
  const shipping = subtotal >= 5000 ? 0 : 500

  if (totals) {
    totals.innerHTML = `
      <div class="cart-total-row"><span>Subtotal</span><span>$${formatPrice(subtotal)}</span></div>
      <div class="cart-total-row ${shipping === 0 ? 'free' : ''}">
        <span>Envío</span><span>${shipping === 0 ? 'Gratis' : '$' + formatPrice(shipping)}</span>
      </div>
      <div class="cart-total-final"><span>Total</span><span>$${formatPrice(subtotal + shipping)}</span></div>
    `
  }
}

// ─── FORMATTING ────────────────────────────

function formatPrice(n) {
  return new Intl.NumberFormat('es-AR').format(n)
}

// ─── CATALOG PAGE ──────────────────────────

function renderCatalog() {
  const grid = document.getElementById('product-grid')
  if (!grid) return

  const activeFilter = document.querySelector('.filter-btn.active')?.dataset?.franchise || 'all'
  const searchTerm = document.getElementById('search')?.value?.toLowerCase() || ''

  const filtered = PRODUCTS.filter(p => {
    if (activeFilter !== 'all' && p.franchise !== activeFilter) return false
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm)) return false
    return true
  })

  grid.innerHTML = filtered.map(p => `
    <a href="product.html?id=${p.id}" class="product-card">
      <img src="${p.image}" alt="${p.name}" class="product-card-img" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22240%22><rect fill=%22%2312121a%22 width=%22240%22 height=%22240%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%236a6a7a%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22>Sin imagen</text></svg>'">
      <div class="product-card-body">
        <span class="product-card-franchise">${p.franchise}</span>
        <h3 class="product-card-name">${p.name}</h3>
        <p class="product-card-price">$${formatPrice(p.price)}</p>
      </div>
    </a>
  `).join('')
}

function filterByFranchise(f, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  renderCatalog()
}

function filterProducts() {
  renderCatalog()
}

// ─── PRODUCT DETAIL PAGE ───────────────────

function renderProductDetail() {
  const container = document.getElementById('product-detail')
  if (!container) return

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  const product = PRODUCTS.find(p => p.id === id)
  if (!product) {
    container.innerHTML = '<p style="text-align:center;padding:60px;color:var(--text-muted);">Producto no encontrado.</p>'
    return
  }

  document.title = `${product.name} | GameStore`

  const variantHtml = product.variants.map(v => `
    <div class="variant-group">
      <div class="variant-label">${v.name}</div>
      <div class="variant-options">
        ${v.options.map(o => `
          <button class="variant-option" data-variant="${o}" onclick="selectVariant('${v.name}', '${o}', this)">
            ${o}
          </button>
        `).join('')}
      </div>
    </div>
  `).join('')

  container.innerHTML = `
    <div class="product-detail">
      <img src="${product.image}" alt="${product.name}" class="product-detail-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22500%22 height=%22500%22><rect fill=%22%2312121a%22 width=%22500%22 height=%22500%22/></svg>'">
      <div class="product-detail-info">
        <span class="product-detail-franchise">${product.franchise} · ${product.platform}</span>
        <h1 class="product-detail-name">${product.name}</h1>
        <p class="product-detail-description">${product.description}</p>
        <p class="product-detail-price">
          $${formatPrice(product.price)}
          <small> ARS</small>
        </p>
        ${variantHtml}
        <div class="qty-selector">
          <label>Cantidad:</label>
          <input type="number" id="qty-input" value="1" min="1" max="10">
        </div>
        <button class="btn btn-primary btn-lg btn-block" onclick="handleAddToCart('${product.id}')">
          Añadir al carrito
        </button>
      </div>
    </div>
  `
}

let selectedVariants = {}

function selectVariant(name, option, btn) {
  selectedVariants[name] = option
  btn.parentElement.querySelectorAll('.variant-option').forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
}

function handleAddToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId)
  const qty = parseInt(document.getElementById('qty-input')?.value || 1)

  // Build variant key
  let variantKey = null
  if (product.variants.length > 0) {
    const parts = product.variants.map(v => selectedVariants[v.name]).filter(Boolean)
    if (parts.length < product.variants.length) {
      alert('Seleccioná todas las variantes primero.')
      return
    }
    variantKey = parts.join(' / ')
  }

  addToCart(productId, variantKey, qty)
  toggleCart()
}

// ─── CHECKOUT PAGE ─────────────────────────

function toggleCodeInput() {
  const type = document.getElementById('codeType')?.value
  document.getElementById('dni-group')?.classList.toggle('hidden', type !== 'dni')
}

function renderCheckout() {
  const itemsContainer = document.getElementById('checkout-items')
  const totalsContainer = document.getElementById('checkout-totals')
  if (!itemsContainer || !totalsContainer) return

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px;">Tu carrito está vacío. <a href="index.html" style="color:var(--accent);">Volver al catálogo</a></p>'
    totalsContainer.innerHTML = ''
    return
  }

  itemsContainer.innerHTML = cart.map(item => `
    <div class="order-summary-item">
      <div>
        <strong>${item.name}</strong>
        ${item.variantName ? `<br><small style="color:var(--text-secondary)">${item.variantName}</small>` : ''}
        <small style="color:var(--text-muted)"> x${item.quantity}</small>
      </div>
      <span>$${formatPrice(item.price * item.quantity)}</span>
    </div>
  `).join('')

  const subtotal = cartSubtotal()
  const shipping = subtotal >= 5000 ? 0 : 500

  totalsContainer.innerHTML = `
    <div class="order-total-row"><span>Subtotal</span><span>$${formatPrice(subtotal)}</span></div>
    <div class="order-total-row"><span>Envío</span><span class="${shipping === 0 ? 'text-success' : ''}">${shipping === 0 ? 'Gratis' : '$' + formatPrice(shipping)}</span></div>
    <div class="order-total-final"><span>Total</span><span>$${formatPrice(subtotal + shipping)}</span></div>
  `
}

function processPayment() {
  // Validate
  const email = document.getElementById('email')?.value.trim()
  const street = document.getElementById('street')?.value.trim()
  const number = document.getElementById('number')?.value.trim()
  const neighborhood = document.getElementById('neighborhood')?.value.trim()
  const city = document.getElementById('city')?.value
  const phone = document.getElementById('phone')?.value.trim()
  const codeType = document.getElementById('codeType')?.value
  const dniInput = document.getElementById('dniInput')?.value.trim()

  if (!email || !street || !number || !neighborhood || !city || !phone || !codeType) {
    alert('Completá todos los campos requeridos (*).')
    return
  }
  if (codeType === 'dni' && !dniInput) {
    alert('Ingresá tu DNI.')
    return
  }
  if (cart.length === 0) {
    alert('Tu carrito está vacío.')
    return
  }

  // Simulate payment processing
  const btn = document.getElementById('mp-btn')
  btn.disabled = true
  btn.textContent = 'Procesando...'

  const confirmationCode = codeType === 'generated'
    ? generateCode()
    : dniInput

  const orderData = {
    items: cart.map(c => ({ name: c.name, variant: c.variantName, qty: c.quantity, price: c.price })),
    subtotal: cartSubtotal(),
    shipping: cartSubtotal() >= 5000 ? 0 : 500,
    email,
    city,
    code: confirmationCode,
  }

  sessionStorage.setItem('pendingOrder', JSON.stringify(orderData))

  setTimeout(() => {
    clearCart()
    window.location.href = 'confirmation.html'
  }, 2000)
}

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ─── CONFIRMATION PAGE ─────────────────────

function renderConfirmation() {
  const codeEl = document.getElementById('confirmation-code')
  const detailsEl = document.getElementById('confirmation-details')
  if (!codeEl || !detailsEl) return

  const raw = sessionStorage.getItem('pendingOrder')
  if (!raw) {
    codeEl.textContent = '------'
    detailsEl.innerHTML = '<p style="color:var(--text-muted);text-align:center;">No hay datos del pedido.</p>'
    return
  }

  const order = JSON.parse(raw)
  codeEl.textContent = order.code

  const total = order.subtotal + order.shipping

  detailsEl.innerHTML = `
    <div class="confirmation-detail-row"><span>Email</span><strong>${order.email}</strong></div>
    <div class="confirmation-detail-row"><span>Ciudad</span><strong>${order.city}</strong></div>
    <div class="confirmation-detail-row"><span>Subtotal</span><strong>$${formatPrice(order.subtotal)}</strong></div>
    <div class="confirmation-detail-row"><span>Envío</span><strong>${order.shipping === 0 ? 'Gratis' : '$' + formatPrice(order.shipping)}</strong></div>
    <div class="confirmation-detail-row"><span>Total</span><strong>$${formatPrice(total)}</strong></div>
    <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);">
      ${order.items.map(i => `
        <div class="confirmation-detail-row">
          <span>${i.name} ${i.variant ? `(${i.variant})` : ''} x${i.qty}</span>
          <span>$${formatPrice(i.price * i.qty)}</span>
        </div>
      `).join('')}
    </div>
  `

  sessionStorage.removeItem('pendingOrder')
}

// ─── INIT ──────────────────────────────────

function init() {
  updateCartUI()
  renderCartItems()

  const path = window.location.pathname

  if (path.endsWith('/') || path.endsWith('index.html')) {
    renderCatalog()
  } else if (path.includes('product.html')) {
    renderProductDetail()
  } else if (path.includes('checkout.html')) {
    renderCheckout()
    toggleCodeInput()
  } else if (path.includes('confirmation.html')) {
    renderConfirmation()
  }
}

document.addEventListener('DOMContentLoaded', init)

// Close cart on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('cart-panel')?.classList.remove('open')
    document.getElementById('cart-overlay')?.classList.remove('open')
  }
})

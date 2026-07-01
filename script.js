const products = window.PRODUCTS || [];
const grid = document.querySelector("[data-product-grid]");
const dialog = document.querySelector("[data-product-dialog]");
const detail = document.querySelector("[data-product-detail]");
const cartPanel = document.querySelector("[data-cart-panel]");
const infoPanel = document.querySelector("[data-info-panel]");
const scrim = document.querySelector("[data-scrim]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartCount = document.querySelector("[data-cart-count]");
const openCartButton = document.querySelector("[data-open-cart]");
const cartTotal = document.querySelector("[data-cart-total]");
const copyStatus = document.querySelector("[data-copy-status]");

let activeFilter = "all";
let activeProduct = null;
let galleryIndex = 0;
let cart = [];

const formatPrice = (value) => value == null ? "Цена по запросу" : new Intl.NumberFormat("ru-RU").format(value) + " ₽";
const getProductImages = (product) => product.images && product.images.length ? product.images : [product.image];

function renderProducts() {
  const visibleProducts = activeFilter === "all"
    ? products
    : products.filter((product) => product.category === activeFilter);

  grid.innerHTML = visibleProducts.map((product) => `
    <button class="product-card" type="button" data-product-id="${product.id}">
      <span class="product-media">
        <img src="${product.image}" alt="${product.title}" loading="lazy">
      </span>
      <span class="product-info">
        <span class="product-name">${product.name}</span>
        <span class="product-title">${product.title}</span>
        <span class="product-status">${product.status}</span>
        <span class="product-price">${formatPrice(product.price)}</span>
      </span>
    </button>
  `).join("");
}

function renderProductDetail() {
  if (!activeProduct) return;

  const images = getProductImages(activeProduct);
  const image = images[galleryIndex];
  const hasGallery = images.length > 1;

  detail.innerHTML = `
    <div class="gallery-stage">
      <button class="gallery-arrow gallery-arrow--prev" type="button" data-gallery-prev aria-label="Предыдущее фото">‹</button>
      <img class="detail-image" src="${image}" alt="${activeProduct.title}">
      <button class="gallery-arrow gallery-arrow--next" type="button" data-gallery-next aria-label="Следующее фото">›</button>
    </div>
    <div class="gallery-meta">
      <div class="gallery-dots" aria-label="Фото товара">
        ${images.map((_, index) => `<button class="gallery-dot${index === galleryIndex ? " is-active" : ""}" type="button" data-gallery-dot="${index}" aria-label="Фото ${index + 1}"></button>`).join("")}
      </div>
      <h2>${activeProduct.name}</h2>
      <p class="gallery-price">${formatPrice(activeProduct.price)}</p>
      <button class="gallery-add" type="button" data-add-to-cart="${activeProduct.id}" aria-label="Добавить в заявку">+</button>
      <p class="detail-description">${activeProduct.description}</p>
    </div>
  `;

  detail.classList.toggle("has-single-image", !hasGallery);
}

function openProduct(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  activeProduct = product;
  galleryIndex = 0;
  renderProductDetail();
  dialog.showModal();
}

function showGalleryImage(nextIndex) {
  if (!activeProduct) return;
  const images = getProductImages(activeProduct);
  galleryIndex = (nextIndex + images.length) % images.length;
  renderProductDetail();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  cart = [...cart, product];
  renderCart();
  if (dialog.open) dialog.close();
  openCart();
}

function removeFromCart(index) {
  cart = cart.filter((_, itemIndex) => itemIndex !== index);
  renderCart();
}

function renderCart() {
  if (cartCount) {
    cartCount.textContent = String(cart.length);
    cartCount.classList.toggle("has-items", cart.length > 0);
  }
  cartEmpty.hidden = cart.length > 0;
  cartItems.innerHTML = cart.map((product, index) => `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.title}">
      <div>
        <strong>${product.name}</strong>
        <span>${formatPrice(product.price)}</span>
      </div>
      <button class="plain-icon" type="button" data-remove-cart="${index}" aria-label="Удалить">×</button>
    </div>
  `).join("");

  const pricedItems = cart.filter((product) => product.price != null);
  const total = pricedItems.reduce((sum, product) => sum + product.price, 0);
  cartTotal.textContent = pricedItems.length === cart.length && cart.length > 0 ? formatPrice(total) : "Цена по запросу";
}

function openCart() {
  closeInfo(false);
  cartPanel.classList.add("is-open");
  cartPanel.setAttribute("aria-hidden", "false");
  scrim.classList.add("is-open");
}

function closeCart(hideScrim = true) {
  cartPanel.classList.remove("is-open");
  cartPanel.setAttribute("aria-hidden", "true");
  if (hideScrim) scrim.classList.remove("is-open");
}

function openInfo() {
  closeCart(false);
  infoPanel.classList.add("is-open");
  infoPanel.setAttribute("aria-hidden", "false");
  scrim.classList.add("is-open");
}

function closeInfo(hideScrim = true) {
  infoPanel.classList.remove("is-open");
  infoPanel.setAttribute("aria-hidden", "true");
  if (hideScrim) scrim.classList.remove("is-open");
}

function closePanels() {
  closeCart(false);
  closeInfo(false);
  scrim.classList.remove("is-open");
}

async function copyOrder() {
  if (cart.length === 0) {
    copyStatus.textContent = "Добавь хотя бы один товар, чтобы собрать заявку.";
    return;
  }

  const lines = cart.map((product, index) => `${index + 1}. ${product.name} - ${product.title} - ${formatPrice(product.price)}`);
  const pricedItems = cart.filter((product) => product.price != null);
  const total = pricedItems.reduce((sum, product) => sum + product.price, 0);
  const totalLine = pricedItems.length === cart.length ? `Итого: ${formatPrice(total)}` : "Итого: Цена по запросу";
  const message = ["Заявка с сайта JEWELRY:", ...lines, totalLine].join("\n");

  try {
    await navigator.clipboard.writeText(message);
    copyStatus.textContent = "Заявка скопирована.";
  } catch {
    copyStatus.textContent = message;
  }
}

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    renderProducts();
  });
});

grid.addEventListener("click", (event) => {
  const card = event.target.closest("[data-product-id]");
  if (card) openProduct(card.dataset.productId);
});

detail.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  const dotButton = event.target.closest("[data-gallery-dot]");

  if (addButton) addToCart(addButton.dataset.addToCart);
  if (event.target.closest("[data-gallery-prev]")) showGalleryImage(galleryIndex - 1);
  if (event.target.closest("[data-gallery-next]")) showGalleryImage(galleryIndex + 1);
  if (dotButton) showGalleryImage(Number(dotButton.dataset.galleryDot));
});

document.addEventListener("keydown", (event) => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
  if (event.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
});

cartItems.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-cart]");
  if (button) removeFromCart(Number(button.dataset.removeCart));
});

if (openCartButton) openCartButton.addEventListener("click", openCart);
document.querySelector("[data-close-cart]").addEventListener("click", () => closeCart());
document.querySelector("[data-open-info]").addEventListener("click", openInfo);
document.querySelector("[data-close-info]").addEventListener("click", () => closeInfo());
document.querySelector("[data-close-product]").addEventListener("click", () => dialog.close());
document.querySelector("[data-copy-order]").addEventListener("click", copyOrder);
scrim.addEventListener("click", closePanels);

renderProducts();
renderCart();

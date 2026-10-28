import "./style.css";

const products = [
  {
    id: 1,
    name: "Logitech G502 HERO",
    brand: "LOGITECH G",
    category: "Mice",
    price: 4499,
    image:
      "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "ASUS ROG Gaming Keyboard",
    brand: "ROG",
    category: "Keyboards",
    price: 6999,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "ANT ESPORTS Gaming Headset",
    brand: "ANT ESPORTS",
    category: "Audio",
    price: 2499,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Logitech G Pro Wireless",
    brand: "LOGITECH G",
    category: "Mice",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "ROG RGB Mechanical Keyboard",
    brand: "ROG",
    category: "Keyboards",
    price: 8499,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "ANT ESPORTS RGB Mouse",
    brand: "ANT ESPORTS",
    category: "Mice",
    price: 1599,
    image:
      "https://images.unsplash.com/photo-1563297007-0686b7003af7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Gaming RGB Headphones",
    brand: "LOGITECH G",
    category: "Audio",
    price: 5999,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "ROG Gaming Mouse",
    brand: "ROG",
    category: "Mice",
    price: 4999,
    image:
      "https://images.unsplash.com/photo-1605773527852-c546a8583ea3?auto=format&fit=crop&w=900&q=85",
  },
];

let cart = JSON.parse(localStorage.getItem("gamezone-cart")) || [];
let activeCategory = "All";

const app = document.querySelector("#app");

function renderAuth(mode = "login", message = "") {
  const isRegister = mode === "register";

  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-brand">
          <div class="auth-logo">GZ</div>
          <h1>GAMEZONE</h1>
          <p>LEVEL UP YOUR GAME</p>
        </div>

        <h2>${isRegister ? "Create account" : "Welcome back"}</h2>
        <p class="auth-subtitle">
          ${isRegister
            ? "Join GameZone and level up your setup."
            : "Sign in to continue your gaming journey."}
        </p>

        <div id="auth-message" class="auth-message"
             role="alert">${message}</div>

        <form id="auth-form">
          ${isRegister ? `
            <label for="auth-name">Full name</label>
            <input id="auth-name" name="name"
                   type="text" placeholder="Your name"
                   required>
          ` : ""}

          <label for="auth-email">Email address</label>
          <input id="auth-email" name="email"
                 type="email" placeholder="you@example.com"
                 required>

          <label for="auth-password">Password</label>
          <input id="auth-password" name="password"
                 type="password" minlength="6"
                 placeholder="Enter your password" required>

          <button class="auth-submit" type="submit">
            ${isRegister ? "CREATE ACCOUNT ↗" : "SIGN IN ↗"}
          </button>
        </form>

        <p class="auth-switch">
          ${isRegister ? "Already have an account?" : "New to GameZone?"}
          <button id="auth-switch" type="button">
            ${isRegister ? "Sign in" : "Create account"}
          </button>
        </p>
      </div>
    </div>
  `;

  const form = document.querySelector("#auth-form");
  const messageBox = document.querySelector("#auth-message");

  if (!message) {
    messageBox.hidden = true;
  }

  document.querySelector("#auth-switch").addEventListener("click", () => {
    renderAuth(isRegister ? "login" : "register");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "PLEASE WAIT...";

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(
      `https://fs-practical.onrender.com/api/users/${isRegister ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          result.errors?.map(error => error.msg).join(", ") ||
          "Authentication failed."
        );
      }

      if (isRegister) {
        renderAuth("login", "Account created. Please sign in.");
        return;
      }

      if (!result.token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      sessionStorage.setItem("gamezone-token", result.token);
      renderApp();
      showToast("Welcome to GameZone!");
    } catch (error) {
      messageBox.hidden = false;
      messageBox.textContent = error.message.includes("fetch")
        ? "Cannot reach the backend. Check that the server is running on port 5000."
        : error.message;

      submitButton.disabled = false;
      submitButton.textContent = isRegister
        ? "CREATE ACCOUNT ↗"
        : "SIGN IN ↗";
    }
  });
}


function money(amount) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

function saveCart() {
  localStorage.setItem("gamezone-cart", JSON.stringify(cart));
}

function cartCount() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

function addToCart(id) {
  const product = products.find((p) => p.id === id);

  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      ...product,
      quantity: 1,
    });
  }

  saveCart();
  renderCart();
  showToast(`${product.name} added to cart`);
}

function increaseQuantity(id) {
  const item = cart.find((p) => p.id === id);

  if (item) {
    item.quantity++;
    saveCart();
    renderCart();
  }
}

function decreaseQuantity(id) {
  const item = cart.find((p) => p.id === id);

  if (!item) return;

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter((p) => p.id !== id);
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter((p) => p.id !== id);
  saveCart();
  renderCart();
}

function renderProducts() {
  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return filtered
    .map(
      (product) => `
      <article class="product-card">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          <span class="product-badge">${product.category}</span>

          <button
            class="heart-btn"
            onclick="showToast('Added to wishlist ❤️')"
          >
            ♡
          </button>
        </div>

        <div class="product-info">
          <div class="product-brand">${product.brand}</div>

          <h3>${product.name}</h3>

          <div class="product-bottom">
            <strong>${money(product.price)}</strong>

            <button
              class="add-btn"
              onclick="addToCart(${product.id})"
            >
              ADD TO CART +
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
}

function renderCart() {
  const oldDrawer = document.querySelector(".cart-overlay");

  if (oldDrawer) {
    oldDrawer.remove();
  }

  const overlay = document.createElement("div");
  overlay.className = "cart-overlay";

  overlay.innerHTML = `
    <div class="cart-drawer">

      <div class="cart-header">
        <div>
          <div class="cart-small-title">GAMEZONE</div>
          <h2>YOUR CART</h2>
        </div>

        <button class="close-cart">×</button>
      </div>

      <div class="cart-content">

        ${
          cart.length === 0
            ? `
              <div class="empty-cart">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some gaming gear to continue.</p>
                <button class="continue-btn">START SHOPPING</button>
              </div>
            `
            : `
              <div class="cart-items">
                ${cart
                  .map(
                    (item) => `
                    <div class="cart-item">

                      <img src="${item.image}" alt="${item.name}">

                      <div class="cart-item-info">
                        <div class="cart-item-brand">${item.brand}</div>
                        <h3>${item.name}</h3>

                        <div class="cart-price">
                          ${money(item.price)}
                        </div>

                        <div class="quantity-row">
                          <button onclick="decreaseQuantity(${item.id})">
                            −
                          </button>

                          <span>${item.quantity}</span>

                          <button onclick="increaseQuantity(${item.id})">
                            +
                          </button>

                          <button
                            class="remove-btn"
                            onclick="removeFromCart(${item.id})"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>

                      <strong class="item-total">
                        ${money(item.price * item.quantity)}
                      </strong>

                    </div>
                  `
                  )
                  .join("")}
              </div>
            `
        }

      </div>

      ${
        cart.length > 0
          ? `
            <div class="cart-footer">

              <div class="summary-line">
                <span>ITEMS</span>
                <strong>${cartCount()}</strong>
              </div>

              <div class="summary-line total-line">
                <span>TOTAL</span>
                <strong>${money(cartTotal())}</strong>
              </div>

              <button class="checkout-btn" id="checkoutButton">
                CHECKOUT →
              </button>

            </div>
          `
          : ""
      }

    </div>
  `;

  document.body.appendChild(overlay);

  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      overlay.remove();
    }
  });

  overlay.querySelector(".close-cart").onclick = () => {
    overlay.remove();
  };

  const continueButton = overlay.querySelector(".continue-btn");

  if (continueButton) {
    continueButton.onclick = () => {
      overlay.remove();
      document
        .querySelector("#products")
        ?.scrollIntoView({ behavior: "smooth" });
    };
  }

  const checkoutButton = overlay.querySelector("#checkoutButton");

  if (checkoutButton) {
    checkoutButton.onclick = openCheckout;
  }
}

function openCheckout() {
  const cartOverlay = document.querySelector(".cart-overlay");

  if (cartOverlay) {
    cartOverlay.remove();
  }

  const checkoutOverlay = document.createElement("div");

  checkoutOverlay.className = "checkout-overlay";

  checkoutOverlay.innerHTML = `
    <div class="checkout-modal">

      <div class="checkout-header">
        <div>
          <div class="cart-small-title">GAMEZONE</div>
          <h2>CHECKOUT</h2>
        </div>

        <button class="close-checkout">×</button>
      </div>

      <form id="checkoutForm">

        <div class="checkout-body">

          <h3>DELIVERY DETAILS</h3>

          <div class="form-grid">

            <div class="form-group">
              <label>FULL NAME</label>
              <input
                type="text"
                id="customerName"
                placeholder="Enter your name"
                required
              >
            </div>

            <div class="form-group">
              <label>PHONE NUMBER</label>
              <input
                type="tel"
                id="phone"
                placeholder="Enter phone number"
                required
              >
            </div>

          </div>

          <div class="form-group">
            <label>ADDRESS</label>
            <textarea
              id="address"
              placeholder="Enter delivery address"
              required
            ></textarea>
          </div>

          <div class="form-grid">

            <div class="form-group">
              <label>CITY</label>
              <input
                type="text"
                id="city"
                placeholder="City"
                required
              >
            </div>

            <div class="form-group">
              <label>PIN CODE</label>
              <input
                type="text"
                id="pincode"
                placeholder="PIN code"
                required
              >
            </div>

          </div>

          <h3 class="payment-heading">MODE OF PAYMENT</h3>

          <div class="payment-options">

            <label class="payment-option">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked
              >
              <span class="payment-icon">📱</span>
              <span>
                <strong>UPI</strong>
                <small>Google Pay / PhonePe / Paytm</small>
              </span>
            </label>

            <label class="payment-option">
              <input
                type="radio"
                name="payment"
                value="CARD"
              >
              <span class="payment-icon">💳</span>
              <span>
                <strong>Credit / Debit Card</strong>
                <small>Secure card payment</small>
              </span>
            </label>

            <label class="payment-option">
              <input
                type="radio"
                name="payment"
                value="COD"
              >
              <span class="payment-icon">💵</span>
              <span>
                <strong>Cash on Delivery</strong>
                <small>Pay when your order arrives</small>
              </span>
            </label>

          </div>

          <div class="checkout-summary">

            <div>
              <span>PRODUCTS</span>
              <strong>${cartCount()}</strong>
            </div>

            <div>
              <span>DELIVERY</span>
              <strong>FREE</strong>
            </div>

            <div class="checkout-total">
              <span>TOTAL</span>
              <strong>${money(cartTotal())}</strong>
            </div>

          </div>

          <button class="place-order-btn" type="submit">
            PLACE ORDER →
          </button>

        </div>

      </form>

    </div>
  `;

  document.body.appendChild(checkoutOverlay);

  checkoutOverlay.querySelector(".close-checkout").onclick = () => {
    checkoutOverlay.remove();
    renderCart();
  };

  checkoutOverlay.addEventListener("click", (event) => {
    if (event.target === checkoutOverlay) {
      checkoutOverlay.remove();
      renderCart();
    }
  });

  checkoutOverlay
    .querySelector("#checkoutForm")
    .addEventListener("submit", placeOrder);
}

function placeOrder(event) {
  event.preventDefault();

  const name = document.querySelector("#customerName").value.trim();
  const payment = document.querySelector(
    'input[name="payment"]:checked'
  ).value;

  if (!name) {
    showToast("Please enter your name");
    return;
  }

  const orderNumber =
    "GZ" + Math.floor(100000 + Math.random() * 900000);

  const total = cartTotal();

  cart = [];
  saveCart();

  document.querySelector(".checkout-overlay")?.remove();

  showOrderSuccess(orderNumber, name, payment, total);
}

function showOrderSuccess(orderNumber, name, payment, total) {
  const success = document.createElement("div");

  success.className = "success-overlay";

  success.innerHTML = `
    <div class="success-modal">

      <div class="success-check">✓</div>

      <div class="cart-small-title">GAMEZONE</div>

      <h2>ORDER PLACED!</h2>

      <p class="success-message">
        Thank you, <strong>${name}</strong>!
      </p>

      <div class="order-box">

        <div>
          <span>ORDER ID</span>
          <strong>#${orderNumber}</strong>
        </div>

        <div>
          <span>PAYMENT</span>
          <strong>${payment}</strong>
        </div>

        <div>
          <span>AMOUNT</span>
          <strong>${money(total)}</strong>
        </div>

      </div>

      <p class="delivery-message">
        Your gaming gear is being prepared for delivery.
      </p>

      <button class="success-btn">
        CONTINUE SHOPPING
      </button>

    </div>
  `;

  document.body.appendChild(success);

  success.querySelector(".success-btn").onclick = () => {
    success.remove();
    updateCartBadge();

    document
      .querySelector("#products")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.querySelector(".cart-badge");

  if (badge) {
    badge.textContent = cartCount();
    badge.style.display = cartCount() > 0 ? "flex" : "none";
  }
}

function showToast(message) {
  const oldToast = document.querySelector(".gamezone-toast");

  if (oldToast) {
    oldToast.remove();
  }

  const toast = document.createElement("div");

  toast.className = "gamezone-toast";
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 10);

  setTimeout(() => {
    toast.classList.remove("show");

    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function renderApp() {
  app.innerHTML = `
    <header class="navbar">

      <div class="logo-area">
        <div class="logo-icon">🎮</div>

        <div>
          <div class="logo">GameZone</div>
          <div class="tagline">Gaming Store</div>
        </div>
      </div>

      <nav>
        <a href="#home">HOME</a>
        <a href="#products">PRODUCTS</a>
        <a href="#brands">BRANDS</a>
        <a href="#deals">DEALS</a>
      </nav>

      <button class="cart-button" id="cartButton">
        🛒
        <span class="cart-badge">
          ${cartCount()}
        </span>
      </button>

    </header>

    <main id="home">

      <section class="hero">

        <div class="hero-content">

          <div class="section-label">
            ⚡ FEATURED GAMING GEAR
          </div>

          <h1>
            BUILD YOUR
            <span>DREAM</span>
            SETUP
          </h1>

          <p>
            Premium gaming gear for competitive gamers,
            streamers and gaming enthusiasts.
          </p>

          <div class="hero-buttons">
            <button
              class="hero-btn"
              onclick="document.querySelector('#products').scrollIntoView({behavior:'smooth'})"
            >
              SHOP NOW →
            </button>

            <button
              class="deal-btn"
              onclick="showToast('🔥 Special gaming deals coming soon!')"
            >
              🔥 VIEW DEALS
            </button>
          </div>

        </div>

        <div class="hero-glow"></div>

      </section>

      <section class="brands-section" id="brands">

        <div class="section-label">
          🎮 TOP GAMING BRANDS
        </div>

        <h2>
          SHOP BY <span>BRAND</span>
        </h2>

        <div class="brand-grid">

          <button onclick="filterBrand('LOGITECH G')">
            <strong>LOGITECH G</strong>
            <small>Gaming Gear</small>
          </button>

          <button onclick="filterBrand('ROG')">
            <strong>ROG</strong>
            <small>Republic of Gamers</small>
          </button>

          <button onclick="filterBrand('ANT ESPORTS')">
            <strong>ANT ESPORTS</strong>
            <small>Gaming Performance</small>
          </button>

        </div>

      </section>

      <section class="products-section" id="products">

        <div class="section-label">
          ⚡ FEATURED GAMING GEAR
        </div>

        <h2>
          EXPLORE OUR <span>PRODUCTS</span>
        </h2>

        <p class="section-description">
          Find the perfect gear for your gaming setup.
        </p>

        <div class="category-buttons">

          ${["All", "Mice", "Keyboards", "Audio"]
            .map(
              (category) => `
                <button
                  class="${activeCategory === category ? "active" : ""}"
                  onclick="filterCategory('${category}')"
                >
                  ${category}
                </button>
              `
            )
            .join("")}

        </div>

        <div class="product-grid">
          ${renderProducts()}
        </div>

      </section>

    </main>

    <footer>
      <div>
        <strong>🎮 GameZone</strong>
        <span>Gaming Store</span>
      </div>

      <p>LEVEL UP YOUR GAME ⚡</p>
    </footer>
  `;

  document.querySelector("#cartButton").onclick = renderCart;

  updateCartBadge();
}

window.addToCart = addToCart;
window.increaseQuantity = increaseQuantity;
window.decreaseQuantity = decreaseQuantity;
window.removeFromCart = removeFromCart;
window.showToast = showToast;

window.filterCategory = (category) => {
  activeCategory = category;
  renderApp();

  document
    .querySelector("#products")
    ?.scrollIntoView({ behavior: "smooth" });
};

window.filterBrand = (brand) => {
  const filtered = products.filter((p) => p.brand === brand);

  activeCategory = "All";

  renderApp();

  document
    .querySelector("#products")
    ?.scrollIntoView({ behavior: "smooth" });

  setTimeout(() => {
    const cards = document.querySelectorAll(".product-card");

    cards.forEach((card, index) => {
      if (filtered.some((p) => p.id === products[index]?.id)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }, 50);
};

renderAuth("login");
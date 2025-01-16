// Constants
const API_URL = 'https://dummyjson.com/products';
const STORAGE_KEY = 'mocart_cart';

// Helper Functions
function sanitizeProduct(product) {
    return {
        id: Number(product.id) || 0,
        title: String(product.title || '').slice(0, 100).replace(/[<>]/g, ''),
        description: String(product.description || '').slice(0, 500).replace(/[<>]/g, ''),
        price: Number(product.price) || 0,
        rating: Number(product.rating) || 0,
        thumbnail: String(product.thumbnail || '')
    };
}

function handleImageError(img) {
    img.onerror = null;
    img.src = 'https://via.placeholder.com/150?text=No+Image';
}

function calculateTotal(items) {
    return items.reduce((total, item) => {
        const itemTotal = Math.round(item.price * item.quantity * 100);
        return total + itemTotal;
    }, 0) / 100;
}

function showFeedback(message, type = 'success') {
    const feedback = document.createElement('div');
    feedback.className = `feedback-message ${type}`;
    feedback.setAttribute('role', 'alert');
    feedback.textContent = message;
    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
}

// Cart Management Functions
function getCart() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (error) {
        console.error('Error reading cart:', error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart:', error);
        showFeedback('Error saving cart', 'error');
    }
}

function addToCart(productId, productName, productPrice, productImage) {
    let cart = getCart();
    
    const sanitizedProduct = {
        id: Number(productId),
        name: String(productName).slice(0, 100).replace(/[<>]/g, ''),
        price: Number(productPrice),
        image: String(productImage),
        quantity: 1
    };

    const existingProduct = cart.find(item => item.id === sanitizedProduct.id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(sanitizedProduct);
    }

    saveCart(cart);
    showFeedback('Added to cart!');
}

function changeQuantity(productId, action) {
    let cart = getCart();
    
    const product = cart.find(item => item.id === productId);
    if (product) {
        if (action === 'increase') {
            product.quantity = Math.min(product.quantity + 1, 99); // Set reasonable max quantity
        } else if (action === 'decrease') {
            product.quantity -= 1;
            if (product.quantity <= 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
        saveCart(cart);
        loadCart();
    }
}

// UI Functions
async function loadProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    try {
        productList.innerHTML = `
            <div class="loading" role="status">
                Loading products...
            </div>`;

        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        const products = data.products || [];

        if (products.length === 0) {
            productList.innerHTML = `
                <div class="error-message" role="alert">
                    No products available.
                </div>`;
            return;
        }

        productList.innerHTML = '';
        products.forEach(product => {
            const sanitizedProduct = sanitizeProduct(product);
            const productDiv = document.createElement('div');
            productDiv.className = 'product-card';
            productDiv.setAttribute('role', 'article');
            
            productDiv.innerHTML = `
                <div class="card">
                    <img src="${sanitizedProduct.thumbnail}" 
                         alt="${sanitizedProduct.title}"
                         onerror="handleImageError(this)">
                    <div class="card-content">
                        <h3>${sanitizedProduct.title}</h3>
                        <p>${sanitizedProduct.description || 'No description available'}</p>
                        <p><strong>Price: $${sanitizedProduct.price.toFixed(2)}</strong></p>
                        <p>Rating: ${sanitizedProduct.rating.toFixed(1)} ⭐</p>
                        <div class="button-container">
                            <button onclick="addToCart(${sanitizedProduct.id}, '${sanitizedProduct.title.replace(/'/g, "\\'")}', ${sanitizedProduct.price}, '${sanitizedProduct.thumbnail}')"
                                    aria-label="Add ${sanitizedProduct.title} to cart">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>`;

            productList.appendChild(productDiv);
        });

    } catch (error) {
        console.error('Error loading products:', error);
        productList.innerHTML = `
            <div class="error-message" role="alert">
                Error loading products. Please try again later.
            </div>`;
    }
}

function loadCart() {
    const cartList = document.getElementById('item-list');
    const totalPriceElement = document.getElementById('total-price');
    if (!cartList || !totalPriceElement) return;

    const cart = getCart();
    cartList.innerHTML = '';

    if (cart.length === 0) {
        cartList.innerHTML = `
            <li class="empty-cart" role="status">
                Your cart is empty
            </li>`;
        totalPriceElement.textContent = '$0.00';
        return;
    }

    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.setAttribute('role', 'listitem');

        li.innerHTML = `
            <img src="${item.image}" 
                 alt="${item.name}" 
                 class="cart-item-img"
                 onerror="handleImageError(this)">
            <span>${item.name} - $${Number(item.price).toFixed(2)}</span>
            <div class="quantity-controls">
                <button onclick="changeQuantity(${item.id}, 'decrease')"
                        aria-label="Decrease quantity of ${item.name}"
                        ${item.quantity <= 1 ? 'aria-description="Remove item from cart"' : ''}>-</button>
                <span aria-label="Quantity">${item.quantity}</span>
                <button onclick="changeQuantity(${item.id}, 'increase')"
                        aria-label="Increase quantity of ${item.name}">+</button>
            </div>`;

        cartList.appendChild(li);
    });

    const totalPrice = calculateTotal(cart);
    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize pages
    if (document.getElementById('product-list')) {
        loadProducts();
    }

    if (document.getElementById('cart-list')) {
        loadCart();
    }

    // Start menu functionality
    const startButton = document.getElementById('start-button');
    const startMenu = document.querySelector('.start-menu-content');

    if (startButton && startMenu) {
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = startMenu.classList.contains('show');
            startButton.setAttribute('aria-expanded', !isExpanded);
            startMenu.classList.toggle('show');
        });

        document.addEventListener('click', (e) => {
            if (!startMenu.contains(e.target) && e.target !== startButton) {
                startMenu.classList.remove('show');
                startButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Cart buttons
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                showFeedback('Your cart is empty!', 'error');
                return;
            }
            alert('Proceeding to checkout!');
            // Add checkout logic here
        });
    }

    const continueShoppingButton = document.getElementById('continue-shopping-button');
    if (continueShoppingButton) {
        continueShoppingButton.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }
});

// Function to load and display products
async function loadProducts() {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        const data = await response.json();
        const products = data.products;

        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-card');
            
            productDiv.innerHTML = `
                <div class="card">
                    <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" alt="${product.title}">
                    <div class="card-content">
                        <h3>${product.title}</h3>
                        <p>${product.description || 'No description available'}</p>
                        <p><strong>Price: $${product.price}</strong></p>
                        <p>Rating: ${product.rating} ⭐</p>
                        <div class="button-container">
                            <button onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.thumbnail}')">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;

            productList.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}


// Function to add a product to the cart
function addToCart(productId, productName, productPrice, productImage) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

}

// Function to load cart items on the cart page
function loadCart() {
    const cartList = document.getElementById('item-list');
    const totalPriceElement = document.getElementById('total-price');
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = 0;

    cartList.innerHTML = '';

    cart.forEach(item => {
        const li = document.createElement('li');
        li.classList.add('cart-item');

        li.innerHTML = `
            <img src="${item.image || 'https://via.placeholder.com/150'}" alt="${item.name}" class="cart-item-img">
            <span>${item.name} - $${item.price}</span>
            <span>Quantity: <button onclick="changeQuantity(${item.id}, 'decrease')">-</button> ${item.quantity} <button onclick="changeQuantity(${item.id}, 'increase')">+</button></span>
        `;


        console.log(item);

        cartList.appendChild(li);
        totalPrice += item.price * item.quantity;
    });

    totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
}

// Function to change the quantity of items in the cart
function changeQuantity(productId, action) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const product = cart.find(item => item.id === productId);
    if (product) {
        if (action === 'increase') {
            product.quantity += 1;
        } else if (action === 'decrease') {
            product.quantity -= 1;
            if (product.quantity === 0) {
                cart = cart.filter(item => item.id !== productId);
            }
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart(); 
}

// Check if the current page is the cart page, then load the cart
if (document.getElementById('cart-list')) {
    loadCart();
}

// Function to handle checkout
const checkoutButton = document.getElementById('checkout-button');
if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
        alert('Proceeding to checkout!');
        // Add checkout logic here
    });
}

// Function to handle continue shopping
const continueShoppingButton = document.getElementById('continue-shopping-button');
if (continueShoppingButton) {
    continueShoppingButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
}


document.getElementById('start-button').addEventListener('click', function() {
    const menu = document.querySelector('.start-menu-content');
    menu.classList.toggle('show'); // Toggle visibility
});

// Close the start menu if clicking outside of it
document.addEventListener('click', function(event) {
    const menu = document.querySelector('.start-menu-content');
    if (!menu.contains(event.target) && event.target.id !== 'start-button') {
        menu.classList.remove('show');
    }
});


document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
});

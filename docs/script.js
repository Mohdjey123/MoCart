// Fetch product data from the DummyJSON API
async function loadProducts() {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    const products = data.products;

    // Get the product list container
    const productList = document.getElementById('product-list');
    
    // Clear the product list in case of reload
    productList.innerHTML = '';

    // Loop through the products and create product cards
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card'); // Add a class for styling

        // Creating the inner HTML for each product card
        productDiv.innerHTML = `
            <div class="card">
                <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" alt="${product.title}">
                <div class="card-content">
                    <h3>${product.title}</h3>
                    <p>${product.description}</p>
                    <p><strong>Price: $${product.price}</strong></p>
                    <p>Rating: ${product.rating} ⭐</p>
                    <div class="button-container">
                        <button onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
        
        // Append the product card to the product list
        productList.appendChild(productDiv);
    });
}

// Function to add a product to the cart
function addToCart(productId) {
    alert(`Product ${productId} added to the cart!`);
    // Cart logic (store product ID in localStorage, etc.)
}

// Call loadProducts to populate the product list
loadProducts();

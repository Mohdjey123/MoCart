async function loadProducts() {
    const response = await fetch('https://dummyjson.com/products')
    const data = await response.json()
    const products = data.products

    const productList = document.getElementById('product-list')

    productList.innerHTML = ''

    products.forEach(product => {
        const productDiv = document.createElement('div')
        productDiv.classList.add('product')       
        
        productDiv.innerHTML = `
            <img src="${product.thumbnail || 'https://via.placeholder.com/150'}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <p>Rating: ${product.rating} ⭐</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `

        productList.appendChild(productDiv);
    });
}

loadProducts();
const API_URL = 'http://localhost:8080/api';

// Check authentication on page load
window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token) {
        window.location.href = 'login.html';
        return;
    }
    
    // Display user greeting
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting && user.name) {
        userGreeting.textContent = `Hi, ${user.name}`;
    }

    // Hero banner taglines
    initHeroTaglines();

    loadProducts();
});

// Load products from API
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    // Show loading state
    productsGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: white;">
            <div class="loading" style="width: 50px; height: 50px; border-width: 5px; margin: 0 auto 20px;"></div>
            <p style="font-size: 18px;">Loading amazing products...</p>
        </div>
    `;
    
    try {
        const response = await fetch(`${API_URL}/products`);
        
        if (response.ok) {
            const products = await response.json();
            displayProducts(products);
        } else {
            // Show demo products if API fails
            displayDemoProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        displayDemoProducts();
    }
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.getElementById('productsGrid');
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px; color: white;">
                <h2>No products available</h2>
                <p>Check back soon for amazing deals!</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = products.map((product, index) => `
        <div class="product-card" style="animation-delay: ${index * 0.1}s">
            <img src="${product.imageUrl || 'https://via.placeholder.com/250x200?text=Product'}" 
                 alt="${product.name}" 
                 class="product-image"
                 onerror="this.src='https://via.placeholder.com/250x200?text=Product'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-rating">
                    <span class="stars">★★★★☆</span>
                    <span>(${Math.floor(Math.random() * 1000) + 100})</span>
                </div>
                <button class="btn-primary" onclick="addToCart(${product.id})" style="margin-top: 12px; padding: 10px;">
                    Add to Cart
                </button>
            </div>
        </div>
    `).join('');
}

// Display demo products
function displayDemoProducts() {
    const demoProducts = [
        { id: 1, name: 'Wireless Headphones', price: 2999, imageUrl: 'https://via.placeholder.com/250x200/2874f0/ffffff?text=Headphones', stock: 50 },
        { id: 2, name: 'Smart Watch', price: 4999, imageUrl: 'https://via.placeholder.com/250x200/fb641b/ffffff?text=Smart+Watch', stock: 30 },
        { id: 3, name: 'Laptop Backpack', price: 1299, imageUrl: 'https://via.placeholder.com/250x200/388e3c/ffffff?text=Backpack', stock: 100 },
        { id: 4, name: 'Bluetooth Speaker', price: 1999, imageUrl: 'https://via.placeholder.com/250x200/f57c00/ffffff?text=Speaker', stock: 75 },
        { id: 5, name: 'Phone Case', price: 499, imageUrl: 'https://via.placeholder.com/250x200/7b1fa2/ffffff?text=Phone+Case', stock: 200 },
        { id: 6, name: 'USB Cable', price: 299, imageUrl: 'https://via.placeholder.com/250x200/c2185b/ffffff?text=USB+Cable', stock: 150 },
        { id: 7, name: 'Wireless Mouse', price: 799, imageUrl: 'https://via.placeholder.com/250x200/0097a7/ffffff?text=Mouse', stock: 80 },
        { id: 8, name: 'Keyboard', price: 1499, imageUrl: 'https://via.placeholder.com/250x200/5d4037/ffffff?text=Keyboard', stock: 60 }
    ];
    
    displayProducts(demoProducts);
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchInput)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Add to cart
function addToCart(productId) {
    alert(`Product ${productId} added to cart! 🛒`);
    // Here you can implement actual cart functionality
}

// Search on Enter key
document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchProducts();
    }
});

// Rotate hero taglines & activate banner slides
function initHeroTaglines() {
    const taglines = [
        'Discover top deals on mobiles, fashion, electronics, and more – all in one place.',
        'Login to unlock personalized recommendations and exclusive offers just for you.',
        'Buy what you love or start selling in minutes with a simple, secure experience.'
    ];

    const heroTagline = document.getElementById('heroTagline');
    const slides = [
        document.querySelector('.banner-slide-1'),
        document.querySelector('.banner-slide-2'),
        document.querySelector('.banner-slide-3')
    ];

    let index = 0;

    const applyState = () => {
        if (heroTagline) {
            heroTagline.textContent = taglines[index % taglines.length];
        }

        slides.forEach((slide, i) => {
            if (!slide) return;
            if (i === index % slides.length) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });
    };

    applyState();

    setInterval(() => {
        index += 1;
        applyState();
    }, 4000);
}

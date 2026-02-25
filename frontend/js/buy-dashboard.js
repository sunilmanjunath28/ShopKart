// buy-dashboard.js - Buyer dashboard functionality

const STORAGE_KEY = 'products'; // Using existing key

// Get all products from localStorage
function getAllProducts() {
    const productsStr = localStorage.getItem(STORAGE_KEY);
    return productsStr ? JSON.parse(productsStr) : [];
}

// Display products
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    console.log('Displaying products:', products.length);
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">🛒</div>
                <h3 style="color: #333; margin-bottom: 10px;">No Products Available</h3>
                <p style="color: #666;">Check back later for new products!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = products.map(p => {
        // Get the image URL - try multiple sources
        let imageUrl = 'https://via.placeholder.com/300?text=No+Image';
        
        if (p.image && p.image.startsWith('data:image')) {
            imageUrl = p.image;
        } else if (p.imageUrl && p.imageUrl.startsWith('data:image')) {
            imageUrl = p.imageUrl;
        } else if (p.images && p.images.length > 0 && p.images[0].startsWith('data:image')) {
            imageUrl = p.images[0];
        } else if (p.image && p.image.startsWith('http')) {
            imageUrl = p.image;
        } else if (p.imageUrl && p.imageUrl.startsWith('http')) {
            imageUrl = p.imageUrl;
        }
        
        return `
            <div class="product-card" onclick="openProductModal(${p.id})" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); cursor: pointer; transition: all 0.3s;">
                <div style="position: relative;">
                    <img src="${imageUrl}" alt="${p.name}" style="width: 100%; height: 250px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/300?text=${encodeURIComponent(p.name)}'">
                    ${p.stock < 10 ? '<div style="position: absolute; top: 15px; right: 15px; background: linear-gradient(135deg, #e94560 0%, #d63447 100%); color: white; padding: 6px 15px; border-radius: 20px; font-size: 12px; font-weight: 600;">Low Stock</div>' : ''}
                    <div onclick="event.stopPropagation(); addToWishlist(${p.id})" style="position: absolute; top: 15px; left: 15px; background: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        ❤️
                    </div>
                </div>
                <div style="padding: 20px;">
                    <div style="color: #667eea; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">
                        ${p.category}
                    </div>
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 18px; font-weight: 600;">
                        ${p.name}
                    </h3>
                    <p style="color: #666; font-size: 13px; margin-bottom: 15px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${p.description}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 15px; border-top: 1px solid #f0f0f0;">
                        <div style="font-size: 24px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            ₹${p.price.toFixed(2)}
                        </div>
                        <div style="display: flex; align-items: center; gap: 5px; font-size: 14px; color: #ffa500; font-weight: 600;">
                            ⭐ ${p.rating || 4.5}
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); quickBuy(${p.id})" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 15px; text-transform: uppercase;">
                        🛒 Buy Now
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Load products
function loadProducts() {
    let products = getAllProducts();
    
    console.log('Loading products...');
    console.log('Total products:', products.length);
    
    // Filter only ACTIVE products
    products = products.filter(p => p.status === 'ACTIVE' && p.stock > 0);
    
    // Sort by createdAt descending (newest first)
    products.sort((a, b) => b.createdAt - a.createdAt);
    
    console.log('Active products:', products.length);
    
    // Display products
    displayProducts(products);
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const query = searchInput.value.toLowerCase();
    let products = getAllProducts();
    
    // Filter active products
    products = products.filter(p => p.status === 'ACTIVE' && p.stock > 0);
    
    // Search filter
    if (query) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }
    
    // Sort by newest first
    products.sort((a, b) => b.createdAt - a.createdAt);
    
    displayProducts(products);
}

// Filter by category
function filterByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const category = categoryFilter.value;
    let products = getAllProducts();
    
    // Filter active products
    products = products.filter(p => p.status === 'ACTIVE' && p.stock > 0);
    
    // Category filter
    if (category) {
        products = products.filter(p => p.category.includes(category));
    }
    
    // Sort by newest first
    products.sort((a, b) => b.createdAt - a.createdAt);
    
    displayProducts(products);
}

// Sort products
function sortProducts() {
    const sortFilter = document.getElementById('sortFilter');
    if (!sortFilter) return;
    
    const sortBy = sortFilter.value;
    let products = getAllProducts();
    
    // Filter active products
    products = products.filter(p => p.status === 'ACTIVE' && p.stock > 0);
    
    // Sort
    switch(sortBy) {
        case 'price-low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            products.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            break;
        case 'newest':
        default:
            products.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    displayProducts(products);
}

// Open product modal
function openProductModal(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Quick buy
async function quickBuy(productId) {
    const products = getAllProducts();
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    // Get current user
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        alert('Please login to place an order');
        window.location.href = 'login.html';
        return;
    }
    
    const user = JSON.parse(userStr);
    
    // Ask for shipping address
    const shippingAddress = prompt('Enter your shipping address:', '');
    if (!shippingAddress || shippingAddress.trim() === '') {
        alert('Shipping address is required!');
        return;
    }
    
    // Create order object
    const order = {
        id: Date.now(),
        buyerId: user.id,
        sellerId: product.sellerId,
        productId: product.id,
        productName: product.name,
        productImage: product.image || product.imageUrl,
        quantity: 1,
        totalPrice: product.price,
        status: 'PENDING',
        shippingAddress: shippingAddress.trim(),
        sellerPhone: product.sellerPhone,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save order to localStorage
    const ordersStr = localStorage.getItem('orders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Try to save to backend
    try {
        const API_URL = 'http://localhost:8080/api';
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(order)
        });
        
        if (response.ok) {
            console.log('Order saved to backend');
        }
    } catch (error) {
        console.log('Backend not available, order saved locally');
    }
    
    alert(`🎉 Order Placed Successfully!\n\nProduct: ${product.name}\nPrice: ₹${product.price.toFixed(2)}\nShipping to: ${shippingAddress}\n\nThe seller will contact you at the registered phone number.`);
    
    // Optionally redirect to orders page
    if (confirm('View your orders?')) {
        window.location.href = 'orders.html';
    }
}

// Add to wishlist
function addToWishlist(productId) {
    const products = getAllProducts();
    const product = products.find(p => p.id === productId);
    
    if (product) {
        alert(`❤️ Added to wishlist: ${product.name}`);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Buy Dashboard loaded');
    
    // Load products immediately
    loadProducts();
    
    // Auto-refresh every 5 seconds to show new products
    setInterval(loadProducts, 5000);
});

// my-items.js - Complete My Items page functionality

const STORAGE_KEY = 'products';
let currentUser = null;

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        const defaultUser = { id: 1, name: 'Test Seller', email: 'seller@test.com' };
        localStorage.setItem('user', JSON.stringify(defaultUser));
        return defaultUser;
    }
    return JSON.parse(userStr);
}

// Get all products
function getAllProducts() {
    const productsStr = localStorage.getItem(STORAGE_KEY);
    return productsStr ? JSON.parse(productsStr) : [];
}

// Get seller products
function getSellerProducts(sellerId) {
    const allProducts = getAllProducts();
    return allProducts.filter(p => p.sellerId == sellerId);
}

// Save products
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Update stats
function updateStats() {
    if (!currentUser) return;
    
    const myProducts = getSellerProducts(currentUser.id);
    
    console.log('Updating stats...');
    console.log('My products:', myProducts.length);
    
    const totalItems = myProducts.length;
    const activeItems = myProducts.filter(p => p.status === 'ACTIVE').length;
    const totalValue = myProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const lowStockItems = myProducts.filter(p => p.stock < 10).length;
    
    // Update DOM
    const totalItemsElem = document.getElementById('totalItems');
    if (totalItemsElem) totalItemsElem.textContent = totalItems;
    
    const activeItemsElem = document.getElementById('activeItems');
    if (activeItemsElem) activeItemsElem.textContent = activeItems;
    
    const totalValueElem = document.getElementById('totalValue');
    if (totalValueElem) totalValueElem.textContent = '₹' + totalValue.toFixed(2);
    
    const lowStockElem = document.getElementById('lowStockItems');
    if (lowStockElem) lowStockElem.textContent = lowStockItems;
    
    console.log('Stats updated:', { totalItems, activeItems, totalValue, lowStockItems });
}

// Display products
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!grid) {
        console.error('Products grid not found');
        return;
    }
    
    console.log('Displaying products:', products.length);
    
    // Debug: Log first product's image data
    if (products.length > 0) {
        const firstProduct = products[0];
        console.log('First product image check:');
        console.log('- Has image:', !!firstProduct.image);
        console.log('- Has imageUrl:', !!firstProduct.imageUrl);
        console.log('- Has images array:', !!firstProduct.images);
        if (firstProduct.image) {
            console.log('- Image type:', firstProduct.image.substring(0, 30) + '...');
        }
    }
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 64px; margin-bottom: 20px;">📦</div>
                <h3 style="color: #333; margin-bottom: 10px;">No Items Published</h3>
                <p style="color: #666; margin-bottom: 30px;">Start by adding your first product!</p>
                <a href="seller-dashboard.html#add-product" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; border-radius: 10px; text-decoration: none; font-weight: 600;">
                    ➕ Add New Item
                </a>
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
            <div class="product-card" style="background: white; border-radius: 15px; overflow: hidden; box-shadow: 0 5px 20px rgba(0,0,0,0.1); transition: all 0.3s;">
                <img src="${imageUrl}" alt="${p.name}" style="width: 100%; height: 200px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/300?text=${encodeURIComponent(p.name)}'">
                <div style="padding: 20px;">
                    <div style="color: #667eea; font-size: 12px; font-weight: 600; margin-bottom: 8px;">📁 ${p.category}</div>
                    <h3 style="margin: 0 0 10px; color: #333; font-size: 18px;">${p.name}</h3>
                    <p style="color: #666; font-size: 14px; margin-bottom: 15px; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                        ${p.description}
                    </p>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 15px; font-size: 13px;">
                        <div><strong>Stock:</strong> ${p.stock}</div>
                        <div><strong>Status:</strong> ${p.status}</div>
                        <div><strong>Brand:</strong> ${p.brand || 'N/A'}</div>
                        <div><strong>Rating:</strong> ⭐ ${p.rating || 0}/5</div>
                    </div>
                    <div style="font-size: 24px; font-weight: 700; color: #667eea; margin-bottom: 15px;">₹${p.price.toFixed(2)}</div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="editProduct(${p.id})" style="flex: 1; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            ✏️ Edit
                        </button>
                        <button onclick="deleteProduct(${p.id})" style="flex: 1; padding: 10px; background: #f44336; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                            🗑️ Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Load products
function loadProducts() {
    if (!currentUser) return;
    
    let myProducts = getSellerProducts(currentUser.id);
    
    console.log('Loading products for user:', currentUser.id);
    console.log('Found products:', myProducts.length);
    
    // Sort by createdAt descending (newest first)
    myProducts.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
    });
    
    // Update stats
    updateStats();
    
    // Display products
    displayProducts(myProducts);
}

// Edit product
function editProduct(productId) {
    const allProducts = getAllProducts();
    const product = allProducts.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    // Create modal HTML
    const modalHTML = `
        <div id="editModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h2 style="color: #333; margin-bottom: 25px; font-size: 28px;">✏️ Edit Product</h2>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Product Name *</label>
                    <input type="text" id="editName" value="${product.name}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Description *</label>
                    <textarea id="editDescription" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; min-height: 100px; resize: vertical;">${product.description}</textarea>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Price (₹) *</label>
                        <input type="number" id="editPrice" value="${product.price}" step="0.01" min="0" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Stock *</label>
                        <input type="number" id="editStock" value="${product.stock}" min="0" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Brand</label>
                        <input type="text" id="editBrand" value="${product.brand || ''}" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                    </div>
                    <div>
                        <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Condition</label>
                        <select id="editCondition" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                            <option value="New" ${product.condition === 'New' ? 'selected' : ''}>New</option>
                            <option value="Like New" ${product.condition === 'Like New' ? 'selected' : ''}>Like New</option>
                            <option value="Used" ${product.condition === 'Used' ? 'selected' : ''}>Used</option>
                        </select>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Warranty</label>
                    <input type="text" id="editWarranty" value="${product.warranty || ''}" placeholder="e.g., 1 year warranty" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 600; margin-bottom: 8px; color: #333;">Status</label>
                    <select id="editStatus" style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                        <option value="ACTIVE" ${product.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                        <option value="INACTIVE" ${product.status === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
                    </select>
                </div>
                
                <div style="display: flex; gap: 15px; margin-top: 30px;">
                    <button onclick="saveProductEdit(${productId})" style="flex: 1; padding: 15px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">
                        💾 Save Changes
                    </button>
                    <button onclick="closeEditModal()" style="flex: 1; padding: 15px; background: #f44336; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Save product edit
function saveProductEdit(productId) {
    // Get form values
    const name = document.getElementById('editName').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const price = parseFloat(document.getElementById('editPrice').value);
    const stock = parseInt(document.getElementById('editStock').value);
    const brand = document.getElementById('editBrand').value.trim();
    const condition = document.getElementById('editCondition').value;
    const warranty = document.getElementById('editWarranty').value.trim();
    const status = document.getElementById('editStatus').value;
    
    // Validate
    if (!name) {
        alert('❌ Please enter product name');
        return;
    }
    
    if (!description) {
        alert('❌ Please enter description');
        return;
    }
    
    if (!price || price <= 0) {
        alert('❌ Please enter valid price');
        return;
    }
    
    if (stock < 0) {
        alert('❌ Stock cannot be negative');
        return;
    }
    
    // Get all products
    const allProducts = getAllProducts();
    const productIndex = allProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        alert('❌ Product not found!');
        return;
    }
    
    // Update product
    allProducts[productIndex] = {
        ...allProducts[productIndex],
        name,
        description,
        price,
        stock,
        brand,
        condition,
        warranty,
        status,
        updatedAt: Date.now()
    };
    
    // Save to localStorage
    saveProducts(allProducts);
    
    console.log('✅ Product updated:', allProducts[productIndex]);
    
    // Close modal
    closeEditModal();
    
    // Reload products
    loadProducts();
    
    // Show success message
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 10px; margin-bottom: 20px; font-weight: 600;">
                ✅ Product updated successfully!
            </div>
        `;
        
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 3000);
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.remove();
    }
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }
    
    console.log('Deleting product:', productId);
    
    const allProducts = getAllProducts();
    const updatedProducts = allProducts.filter(p => p.id !== productId);
    
    saveProducts(updatedProducts);
    
    console.log('Product deleted. Remaining:', updatedProducts.length);
    
    // Reload products
    loadProducts();
    
    // Show success message
    const alertContainer = document.getElementById('alertContainer');
    if (alertContainer) {
        alertContainer.innerHTML = `
            <div style="background: #d4edda; color: #155724; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                ✅ Item deleted successfully!
            </div>
        `;
        
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 3000);
    }
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput || !currentUser) return;
    
    const query = searchInput.value.toLowerCase();
    let myProducts = getSellerProducts(currentUser.id);
    
    if (query) {
        myProducts = myProducts.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }
    
    myProducts.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
    });
    
    displayProducts(myProducts);
}

// Filter by category
function filterByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter || !currentUser) return;
    
    const category = categoryFilter.value;
    let myProducts = getSellerProducts(currentUser.id);
    
    if (category) {
        myProducts = myProducts.filter(p => p.category.includes(category));
    }
    
    myProducts.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
    });
    
    displayProducts(myProducts);
}

// Filter by status
function filterByStatus() {
    const statusFilter = document.getElementById('statusFilter');
    if (!statusFilter || !currentUser) return;
    
    const status = statusFilter.value;
    let myProducts = getSellerProducts(currentUser.id);
    
    if (status) {
        myProducts = myProducts.filter(p => p.status === status);
    }
    
    myProducts.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
    });
    
    displayProducts(myProducts);
}

// Show all products (debug)
function showAllProducts() {
    const allProducts = getAllProducts();
    console.log('All products:', allProducts);
    alert(`Total products in storage: ${allProducts.length}\n\nCheck console (F12) for details`);
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== MY ITEMS PAGE LOADED ===');
    
    // Get current user
    currentUser = getCurrentUser();
    console.log('Current user:', currentUser);
    
    // Load products immediately
    loadProducts();
    
    // Auto-refresh every 3 seconds
    setInterval(() => {
        updateStats();
    }, 3000);
    
    console.log('✅ Page initialized successfully');
});

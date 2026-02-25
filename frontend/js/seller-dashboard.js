// seller-dashboard.js - Complete seller dashboard functionality

const STORAGE_KEY = 'products';
let currentUser = null;
let selectedCategories = [];
let uploadedImages = [];

// Categories list
const categories = [
    { name: 'Groceries', icon: '🛒' },
    { name: 'Electronics', icon: '📱' },
    { name: 'Fashion', icon: '👗' },
    { name: 'Gadgets', icon: '⌚' },
    { name: 'Home Appliances', icon: '🏠' },
    { name: 'Kitchen Items', icon: '🍳' },
    { name: 'Toys', icon: '🧸' },
    { name: 'Books', icon: '📚' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Beauty', icon: '💄' },
    { name: 'Furniture', icon: '🛋️' },
    { name: 'Automotive', icon: '🚗' },
    { name: 'Baby Products', icon: '👶' },
    { name: 'Pet Supplies', icon: '🐾' },
    { name: 'Health & Wellness', icon: '💊' },
    { name: 'Jewelry', icon: '💍' },
    { name: 'Office Supplies', icon: '📎' },
    { name: 'Garden', icon: '🌱' },
    { name: 'Music', icon: '🎸' },
    { name: 'Gaming', icon: '🎮' }
];

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
    try {
        const productsStr = localStorage.getItem(STORAGE_KEY);
        if (!productsStr) {
            console.log('No products in localStorage, returning empty array');
            return [];
        }
        const products = JSON.parse(productsStr);
        console.log('Loaded products from localStorage:', products.length);
        return Array.isArray(products) ? products : [];
    } catch (error) {
        console.error('Error reading products from localStorage:', error);
        alert('⚠️ Error loading products. localStorage might be full or corrupted. Returning empty list.');
        return [];
    }
}

// Get seller products
function getSellerProducts(sellerId) {
    try {
        const allProducts = getAllProducts();
        const sellerProducts = allProducts.filter(p => p.sellerId == sellerId);
        console.log(`Seller ${sellerId} has ${sellerProducts.length} products`);
        return sellerProducts;
    } catch (error) {
        console.error('Error filtering seller products:', error);
        return [];
    }
}

// Save products
function saveProducts(products) {
    try {
        if (!Array.isArray(products)) {
            console.error('saveProducts: products is not an array', products);
            throw new Error('Products must be an array');
        }
        
        const productsStr = JSON.stringify(products);
        
        // Check localStorage quota
        const estimatedSize = new Blob([productsStr]).size;
        console.log(`Attempting to save ${products.length} products (${(estimatedSize / 1024).toFixed(2)} KB)`);
        
        // Try to save
        localStorage.setItem(STORAGE_KEY, productsStr);
        console.log('✅ Products saved successfully to localStorage');
        
        // Verify save
        const verification = localStorage.getItem(STORAGE_KEY);
        if (!verification) {
            throw new Error('Save verification failed - data not found after save');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error saving products to localStorage:', error);
        
        if (error.name === 'QuotaExceededError' || error.message.includes('quota')) {
            alert('⚠️ Storage quota exceeded!\n\nYour browser storage is full. Please:\n1. Delete some old products\n2. Clear browser cache\n3. Use a different browser');
        } else {
            alert('⚠️ Error saving product!\n\nError: ' + error.message + '\n\nPlease try again or contact support.');
        }
        
        return false;
    }
}

// Update dashboard stats
function updateDashboardStats() {
    if (!currentUser) return;
    
    const myProducts = getSellerProducts(currentUser.id);
    
    console.log('Updating dashboard stats...');
    console.log('User ID:', currentUser.id);
    console.log('My products:', myProducts.length);
    
    // Update Total Products
    const totalProductsElem = document.getElementById('totalProducts');
    if (totalProductsElem) {
        totalProductsElem.textContent = myProducts.length;
    }
    
    // Update Active Items
    const activeItems = myProducts.filter(p => p.status === 'ACTIVE').length;
    const activeItemsElem = document.getElementById('activeItems');
    if (activeItemsElem) {
        activeItemsElem.textContent = activeItems;
    }
    
    // Update Total Sales
    const totalSalesElem = document.getElementById('totalSales');
    if (totalSalesElem) {
        const totalValue = myProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
        totalSalesElem.textContent = '₹' + totalValue.toFixed(2);
    }
    
    // Update Orders
    const totalOrdersElem = document.getElementById('totalOrders');
    if (totalOrdersElem) {
        totalOrdersElem.textContent = '0';
    }
    
    console.log('Stats updated successfully');
}

// Load recent products
function loadRecentProducts() {
    if (!currentUser) return;
    
    const myProducts = getSellerProducts(currentUser.id);
    
    // Sort by createdAt descending (newest first)
    myProducts.sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
    });
    
    // Take first 5
    const recentProducts = myProducts.slice(0, 5);
    
    const container = document.getElementById('recentActivity');
    if (!container) return;
    
    if (recentProducts.length === 0) {
        container.innerHTML = '<p style="color: #666;">No products yet. Start by adding your first item!</p>';
        return;
    }
    
    container.innerHTML = `
        <h3 style="margin: 30px 0 15px; color: #333;">Recent Products</h3>
        <div style="display: grid; gap: 15px;">
            ${recentProducts.map(p => `
                <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; display: flex; gap: 15px; align-items: center;">
                    <img src="${p.image || p.imageUrl || 'https://via.placeholder.com/60'}" alt="${p.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 5px; color: #333;">${p.name}</h4>
                        <p style="margin: 0; color: #666; font-size: 14px;">₹${p.price.toFixed(2)} • Stock: ${p.stock}</p>
                    </div>
                    <span style="background: #4CAF50; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px;">${p.status}</span>
                </div>
            `).join('')}
        </div>
    `;
}

// Load categories
function loadCategories() {
    const container = document.getElementById('categoryOptions');
    if (!container) {
        console.log('Category container not found');
        return;
    }
    
    console.log('Loading categories...');
    
    container.innerHTML = categories.map(cat => `
        <div class="category-option" data-category="${cat.name}">
            ${cat.icon} ${cat.name}
        </div>
    `).join('');
    
    // Add click handlers
    document.querySelectorAll('.category-option').forEach(option => {
        option.addEventListener('click', function() {
            const category = this.dataset.category;
            
            if (this.classList.contains('selected')) {
                // Deselect
                this.classList.remove('selected');
                selectedCategories = selectedCategories.filter(c => c !== category);
            } else if (selectedCategories.length < 2) {
                // Select (max 2)
                this.classList.add('selected');
                selectedCategories.push(category);
            } else {
                showAlert('Maximum 2 categories allowed', 'error');
            }
            
            // Update hidden input
            const categoryInput = document.getElementById('productCategory');
            if (categoryInput) {
                categoryInput.value = selectedCategories.join(', ');
            }
            
            console.log('Selected categories:', selectedCategories);
        });
    });
    
    console.log('✅ Categories loaded successfully');
}

// Setup image upload
function setupImageUpload() {
    const imageInput = document.getElementById('imageInput');
    if (!imageInput) {
        console.log('Image input not found');
        return;
    }
    
    imageInput.addEventListener('change', function(e) {
        const files = e.target.files;
        console.log('Files selected:', files.length);
        
        Array.from(files).forEach(file => {
            if (uploadedImages.length >= 5) {
                showAlert('Maximum 5 images allowed', 'error');
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                showAlert(`${file.name} is too large (max 5MB)`, 'error');
                return;
            }
            
            if (!file.type.startsWith('image/')) {
                showAlert(`${file.name} is not an image`, 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                // Compress image before storing
                compressImage(e.target.result, (compressed) => {
                    uploadedImages.push(compressed);
                    displayImages();
                });
            };
            reader.readAsDataURL(file);
        });
    });
    
    console.log('✅ Image upload setup complete');
}

// Compress image
function compressImage(dataUrl, callback) {
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimensions
        const maxWidth = 800;
        const maxHeight = 800;
        
        if (width > height) {
            if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
            }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to JPEG with 0.5 quality (more compression)
        const compressed = canvas.toDataURL('image/jpeg', 0.5);
        callback(compressed);
    };
    img.src = dataUrl;
}

// Display images
function displayImages() {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;
    
    preview.innerHTML = uploadedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview ${index + 1}">
            <button type="button" class="remove-btn" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

// Remove image
function removeImage(index) {
    uploadedImages.splice(index, 1);
    console.log('Image removed, remaining:', uploadedImages.length);
    displayImages();
}

// Setup form submission
function setupFormSubmit() {
    const form = document.getElementById('productForm');
    if (!form) {
        console.log('Product form not found');
        return;
    }
    
    console.log('✅ Product form found, attaching submit handler');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        console.log('=== FORM SUBMISSION STARTED ===');
        console.log('Selected categories:', selectedCategories);
        console.log('Uploaded images:', uploadedImages.length);
        
        // Get form values first
        const name = document.getElementById('productName')?.value.trim();
        const description = document.getElementById('productDescription')?.value.trim();
        const price = parseFloat(document.getElementById('productPrice')?.value);
        const stock = parseInt(document.getElementById('productStock')?.value);
        const sellerPhone = document.getElementById('sellerPhone')?.value.trim();
        
        console.log('Form values:', { name, description, price, stock, sellerPhone });
        
        // Collect all validation errors
        const errors = [];
        
        if (!name) errors.push('Product Name is required');
        if (!description) errors.push('Product Description is required');
        if (!price || price <= 0) errors.push('Valid Price is required');
        if (!stock || stock <= 0) errors.push('Valid Stock Quantity is required');
        if (!sellerPhone) errors.push('Contact Phone is required');
        if (selectedCategories.length === 0) errors.push('At least one Category must be selected');
        if (uploadedImages.length === 0) errors.push('At least one Product Image must be uploaded');
        
        // Show all errors at once
        if (errors.length > 0) {
            const errorMessage = '⚠️ Please complete the following:\n\n' + errors.map((e, i) => `${i + 1}. ${e}`).join('\n');
            alert(errorMessage);
            showAlert('Please fill all required fields', 'error');
            console.log('Validation failed:', errors);
            return;
        }
        
        console.log('✅ All validations passed');
        
        // Create product object
        const product = {
            id: Date.now(),
            name: name,
            description: description,
            price: price,
            stock: stock,
            category: selectedCategories.join(', '),
            image: uploadedImages[0], // Main image
            imageUrl: uploadedImages[0],
            images: uploadedImages, // All images
            seller: currentUser.name,
            sellerId: currentUser.id,
            sellerPhone: sellerPhone,
            brand: 'Generic',
            condition: 'New',
            warranty: 'No warranty',
            status: 'ACTIVE',
            rating: 0,
            reviews: 0,
            createdAt: new Date().toISOString()
        };
        
        console.log('Product object created:', product);
        
        // Get existing products
        const products = getAllProducts();
        console.log('Existing products:', products.length);
        
        // Add new product
        products.push(product);
        
        // Save to localStorage
        saveProducts(products);
        
        console.log('✅ Product saved! Total products:', products.length);
        
        // Show success message
        showAlert('✅ Item published successfully!', 'success');
        alert('🎉 Success! Your item has been published.');
        
        // Reset form
        form.reset();
        selectedCategories = [];
        uploadedImages = [];
        document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
        displayImages();
        
        // Update stats
        setTimeout(updateDashboardStats, 100);
        setTimeout(updateDashboardStats, 500);
        setTimeout(loadRecentProducts, 600);
        setTimeout(loadMyProducts, 700);
        
        // Switch to My Items view to show the published product
        setTimeout(() => {
            document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
            document.getElementById('my-products').classList.add('active');
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            document.querySelector('[data-section="my-products"]').classList.add('active');
        }, 1000);
    });
    
    console.log('✅ Form submit handler attached successfully');
}

// Setup menu navigation
function setupMenuNavigation() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            const section = this.dataset.section;
            
            // If no data-section, it's an external link - let it navigate normally
            if (!section) {
                console.log('External link, allowing navigation');
                return;
            }
            
            // Prevent default only for internal sections
            e.preventDefault();
            
            console.log('Switching to section:', section);
            
            // Hide all sections
            document.querySelectorAll('.form-section').forEach(s => {
                s.classList.remove('active');
            });
            
            // Show selected section
            const targetSection = document.getElementById(section);
            if (targetSection) {
                targetSection.classList.add('active');
            }
            
            // Update active menu item
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            
            // Load categories if switching to add-product section
            if (section === 'add-product') {
                setTimeout(loadCategories, 100);
            }
            
            // Load my products if switching to my-products section
            if (section === 'my-products') {
                setTimeout(loadMyProducts, 100);
            }
            
            // Load orders if switching to orders section
            if (section === 'orders') {
                setTimeout(loadSellerOrders, 100);
            }
        });
    });
    
    console.log('✅ Menu navigation setup complete');
}

// Show alert
function showAlert(message, type) {
    const container = document.getElementById('alertContainer');
    if (!container) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
    container.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// Refresh dashboard
function refreshDashboard() {
    console.log('Manual refresh triggered');
    updateDashboardStats();
    loadRecentProducts();
    showAlert('✅ Dashboard refreshed!', 'success');
}

// Debug function
function debugDashboard() {
    const allProducts = getAllProducts();
    const myProducts = currentUser ? getSellerProducts(currentUser.id) : [];
    
    console.log('=== DEBUG INFO ===');
    console.log('User:', currentUser);
    console.log('Total products in storage:', allProducts.length);
    console.log('My products:', myProducts.length);
    console.log('All products:', allProducts);
    console.log('My products:', myProducts);
    
    alert(`Debug Info:\n\nUser ID: ${currentUser ? currentUser.id : 'N/A'}\nTotal Products: ${allProducts.length}\nMy Products: ${myProducts.length}\n\nCheck console (F12) for details`);
}

// Clear corrupted products data
window.clearProductsData = function() {
    if (confirm('⚠️ WARNING: This will delete ALL products data!\n\nAre you sure you want to continue?')) {
        if (confirm('This action cannot be undone. Continue?')) {
            try {
                localStorage.removeItem(STORAGE_KEY);
                console.log('✅ Products data cleared');
                alert('✅ Products data has been cleared. Page will reload.');
                location.reload();
            } catch (error) {
                console.error('Error clearing products:', error);
                alert('❌ Error clearing data: ' + error.message);
            }
        }
    }
};

// Fix corrupted products data
window.fixProductsData = function() {
    try {
        const products = getAllProducts();
        
        if (!Array.isArray(products)) {
            console.error('Products is not an array, resetting...');
            localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
            alert('✅ Fixed corrupted data. Products reset to empty array.');
            location.reload();
            return;
        }
        
        // Remove invalid products
        const validProducts = products.filter(p => {
            return p && 
                   typeof p === 'object' && 
                   p.id && 
                   p.name && 
                   p.price !== undefined &&
                   p.sellerId !== undefined;
        });
        
        if (validProducts.length !== products.length) {
            console.log(`Removed ${products.length - validProducts.length} invalid products`);
            saveProducts(validProducts);
            alert(`✅ Fixed! Removed ${products.length - validProducts.length} corrupted products.\n\nValid products: ${validProducts.length}`);
            location.reload();
        } else {
            alert('✅ No corrupted products found. Data is healthy!');
        }
    } catch (error) {
        console.error('Error fixing products:', error);
        alert('❌ Error fixing data: ' + error.message);
    }
};

// Load My Products
function loadMyProducts() {
    if (!currentUser) return;
    
    const myProducts = getSellerProducts(currentUser.id);
    
    console.log('Loading my products...');
    console.log('Total my products:', myProducts.length);
    
    const container = document.getElementById('myProductsList');
    if (!container) return;
    
    if (myProducts.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 80px; margin-bottom: 20px;">📦</div>
                <h3 style="color: #333; margin-bottom: 10px;">No Items Yet</h3>
                <p>Start by adding your first product!</p>
                <button onclick="document.querySelector('[data-section=\\'add-product\\']').click()" 
                        style="margin-top: 20px; padding: 12px 30px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600;">
                    ➕ Add Your First Item
                </button>
            </div>
        `;
        return;
    }
    
    // Sort by newest first
    myProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; padding: 20px 0;">
            ${myProducts.map(product => `
                <div style="background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s;">
                    <img src="${product.image || product.imageUrl || 'https://via.placeholder.com/280x200'}" 
                         alt="${product.name}" 
                         style="width: 100%; height: 200px; object-fit: cover;"
                         onerror="this.src='https://via.placeholder.com/280x200'">
                    <div style="padding: 15px;">
                        <h3 style="margin: 0 0 8px; color: #333; font-size: 18px;">${product.name}</h3>
                        <p style="margin: 0 0 10px; color: #666; font-size: 14px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                            ${product.description}
                        </p>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                            <span style="font-size: 20px; font-weight: 700; color: #667eea;">₹${product.price.toFixed(2)}</span>
                            <span style="background: #e8f5e9; color: #4CAF50; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                                Stock: ${product.stock}
                            </span>
                        </div>
                        <div style="display: flex; gap: 8px; margin-top: 12px;">
                            <button onclick="editProduct(${product.id})" 
                                    style="flex: 1; padding: 8px; background: #667eea; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                                ✏️ Edit
                            </button>
                            <button onclick="deleteProduct(${product.id})" 
                                    style="flex: 1; padding: 8px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">
                                🗑️ Delete
                            </button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Edit product
function editProduct(productId) {
    alert('Edit functionality coming soon! Product ID: ' + productId);
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }
    
    const products = getAllProducts();
    const updatedProducts = products.filter(p => p.id !== productId);
    saveProducts(updatedProducts);
    
    showAlert('✅ Product deleted successfully!', 'success');
    loadMyProducts();
    updateDashboardStats();
    loadRecentProducts();
}

// Load seller orders
function loadSellerOrders() {
    if (!currentUser) return;
    
    const ordersStr = localStorage.getItem('orders');
    const allOrders = ordersStr ? JSON.parse(ordersStr) : [];
    
    // Filter orders for this seller
    const myOrders = allOrders.filter(o => o.sellerId == currentUser.id);
    
    console.log('Loading seller orders...');
    console.log('Total orders:', allOrders.length);
    console.log('My orders:', myOrders.length);
    
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    if (myOrders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <div style="font-size: 64px; margin-bottom: 20px;">📦</div>
                <h3>No Orders Yet</h3>
                <p>Orders from buyers will appear here.</p>
            </div>
        `;
        return;
    }
    
    // Sort by newest first
    myOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = myOrders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div class="order-info-item">
                    <div class="order-label">Order ID</div>
                    <div class="order-value">#${order.id}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-label">Date</div>
                    <div class="order-value">${new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div class="order-info-item">
                    <div class="order-label">Status</div>
                    <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-info-item">
                    <div class="order-label">Total</div>
                    <div class="order-value" style="color: #667eea;">₹${order.totalPrice.toFixed(2)}</div>
                </div>
            </div>
            
            <div class="order-product">
                <img src="${order.productImage || 'https://via.placeholder.com/80'}" 
                     alt="${order.productName}" 
                     class="order-product-image"
                     onerror="this.src='https://via.placeholder.com/80'">
                <div class="order-product-info">
                    <h4>${order.productName}</h4>
                    <p><strong>Quantity:</strong> ${order.quantity}</p>
                    <p><strong>Shipping Address:</strong> ${order.shippingAddress}</p>
                </div>
            </div>
            
            <div class="order-footer">
                <div class="order-total">Total: ₹${order.totalPrice.toFixed(2)}</div>
                <div class="order-actions">
                    ${order.status === 'PENDING' ? `
                        <button class="btn-order-action btn-accept" onclick="updateOrderStatus(${order.id}, 'CONFIRMED')">
                            ✓ Accept Order
                        </button>
                    ` : ''}
                    <button class="btn-order-action btn-contact" onclick="contactBuyer(${order.buyerId})">
                        📞 Contact Buyer
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update total orders count
    const totalOrdersElem = document.getElementById('totalOrders');
    if (totalOrdersElem) {
        totalOrdersElem.textContent = myOrders.length;
    }
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    const ordersStr = localStorage.getItem('orders');
    const orders = ordersStr ? JSON.parse(ordersStr) : [];
    
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        orders[orderIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('orders', JSON.stringify(orders));
        
        showAlert(`✅ Order #${orderId} status updated to ${newStatus}`, 'success');
        loadSellerOrders();
    }
}

// Contact buyer
function contactBuyer(buyerId) {
    console.log('📞 Contact buyer:', buyerId);
    
    // Find the order with this buyer
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const buyerOrder = orders.find(o => o.buyerId == buyerId);
    
    if (!buyerOrder) {
        alert('❌ Order not found!');
        return;
    }
    
    // Try to get buyer profile from localStorage
    let buyerProfile = null;
    
    // Check if buyer has saved profile
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        if (user.id == buyerId) {
            buyerProfile = user;
        }
    }
    
    // If not found, try to get from email-based storage (if we have buyer email)
    if (!buyerProfile && buyerOrder.buyerEmail) {
        const profileKey = 'profile_' + buyerOrder.buyerEmail;
        const savedProfile = localStorage.getItem(profileKey);
        if (savedProfile) {
            buyerProfile = JSON.parse(savedProfile);
            buyerProfile.email = buyerOrder.buyerEmail;
        }
    }
    
    // Build buyer information
    const buyerName = buyerProfile?.name || buyerOrder.buyerName || 'Buyer #' + buyerId;
    const buyerPhone = buyerProfile?.phone || buyerOrder.buyerPhone || 'Not available';
    const buyerEmail = buyerProfile?.email || buyerOrder.buyerEmail || 'Not available';
    const buyerCity = buyerProfile?.city || 'Not available';
    const buyerPincode = buyerProfile?.pincode || '';
    const shippingAddress = buyerOrder.shippingAddress || 'Not provided';
    
    // Create modal with buyer information
    const modalHTML = `
        <div id="buyerContactModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); z-index: 1000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
                <h2 style="color: #333; margin-bottom: 25px; font-size: 28px; text-align: center;">📞 Buyer Contact Information</h2>
                
                <!-- Buyer Profile Card -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin-bottom: 25px; color: white; text-align: center;">
                    <div style="width: 80px; height: 80px; border-radius: 50%; background: white; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 36px;">
                        👤
                    </div>
                    <h3 style="font-size: 24px; margin-bottom: 5px;">${buyerName}</h3>
                    <p style="opacity: 0.9; font-size: 14px;">Order ID: #${buyerOrder.id}</p>
                </div>
                
                <!-- Contact Details -->
                <div style="background: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #333; margin-bottom: 15px; font-size: 18px;">📱 Contact Details</h4>
                    
                    <div style="margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 24px;">📱</span>
                        <div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">Phone Number</div>
                            <div style="font-size: 16px; font-weight: 600; color: #667eea;">${buyerPhone}</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 15px; padding: 12px; background: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 24px;">📧</span>
                        <div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">Email Address</div>
                            <div style="font-size: 14px; font-weight: 500; color: #333;">${buyerEmail}</div>
                        </div>
                    </div>
                    
                    ${buyerCity !== 'Not available' ? `
                    <div style="padding: 12px; background: white; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
                        <span style="font-size: 24px;">📍</span>
                        <div>
                            <div style="font-size: 12px; color: #666; margin-bottom: 3px;">Location</div>
                            <div style="font-size: 14px; font-weight: 500; color: #333;">${buyerCity}${buyerPincode ? ' - ' + buyerPincode : ''}</div>
                        </div>
                    </div>
                    ` : ''}
                </div>
                
                <!-- Shipping Address -->
                <div style="background: #fff3cd; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #ffc107;">
                    <h4 style="color: #333; margin-bottom: 12px; font-size: 18px;">📦 Shipping Address</h4>
                    <p style="color: #333; font-size: 15px; line-height: 1.6; margin: 0;">${shippingAddress}</p>
                </div>
                
                <!-- Order Details -->
                <div style="background: #e7f3ff; padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 2px solid #2196F3;">
                    <h4 style="color: #333; margin-bottom: 12px; font-size: 18px;">🛒 Order Details</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size: 14px;">
                        <div><strong>Product:</strong> ${buyerOrder.productName}</div>
                        <div><strong>Quantity:</strong> ${buyerOrder.quantity}</div>
                        <div><strong>Total:</strong> ₹${buyerOrder.totalPrice.toFixed(2)}</div>
                        <div><strong>Status:</strong> ${buyerOrder.status}</div>
                    </div>
                </div>
                
                <!-- Action Buttons -->
                <div style="display: flex; gap: 15px;">
                    ${buyerPhone !== 'Not available' ? `
                    <a href="tel:${buyerPhone}" style="flex: 1; padding: 15px; background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; text-align: center; text-decoration: none; display: block;">
                        📞 Call Buyer
                    </a>
                    ` : ''}
                    <button onclick="closeBuyerContactModal()" style="flex: 1; padding: 15px; background: #667eea; color: white; border: none; border-radius: 10px; font-size: 16px; font-weight: 700; cursor: pointer;">
                        ✓ Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Close buyer contact modal
function closeBuyerContactModal() {
    const modal = document.getElementById('buyerContactModal');
    if (modal) {
        modal.remove();
    }
}

// Manual publish function for testing
window.manualPublish = function() {
    console.log('=== MANUAL PUBLISH TRIGGERED ===');
    
    if (!currentUser) {
        alert('❌ No user logged in!');
        return;
    }
    
    const name = document.getElementById('productName')?.value.trim();
    const description = document.getElementById('productDescription')?.value.trim();
    const price = parseFloat(document.getElementById('productPrice')?.value);
    const stock = parseInt(document.getElementById('productStock')?.value);
    const sellerPhone = document.getElementById('sellerPhone')?.value.trim();
    
    console.log('Form values:', { name, description, price, stock, sellerPhone });
    console.log('Categories:', selectedCategories);
    console.log('Images:', uploadedImages.length);
    
    if (!name || !description || !price || !stock || !sellerPhone || selectedCategories.length === 0 || uploadedImages.length === 0) {
        alert('❌ Please fill all required fields:\n\n' +
              '✓ Product Name\n' +
              '✓ Description\n' +
              '✓ Price\n' +
              '✓ Stock\n' +
              '✓ Phone\n' +
              '✓ At least 1 Category\n' +
              '✓ At least 1 Image');
        return;
    }
    
    const product = {
        id: Date.now(),
        name: name,
        description: description,
        price: price,
        stock: stock,
        category: selectedCategories.join(', '),
        image: uploadedImages[0],
        imageUrl: uploadedImages[0],
        images: uploadedImages,
        seller: currentUser.name,
        sellerId: currentUser.id,
        sellerPhone: sellerPhone,
        brand: 'Generic',
        condition: 'New',
        warranty: 'No warranty',
        status: 'ACTIVE',
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString()
    };
    
    const products = getAllProducts();
    products.push(product);
    saveProducts(products);
    
    alert('✅ Product published successfully!');
    console.log('Product saved:', product);
    
    // Reset and refresh
    document.getElementById('productForm').reset();
    selectedCategories = [];
    uploadedImages = [];
    displayImages();
    
    updateDashboardStats();
    loadMyProducts();
    
    // Switch to My Items
    document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
    document.getElementById('my-products').classList.add('active');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    document.querySelector('[data-section="my-products"]').classList.add('active');
};

// Handle publish button click
window.handlePublish = function() {
    console.log('=== PUBLISH BUTTON CLICKED ===');
    
    if (!currentUser) {
        alert('❌ Error: No user logged in! Please refresh the page.');
        console.error('currentUser is null');
        return;
    }
    
    console.log('Current user:', currentUser);
    
    // Get form values
    const name = document.getElementById('productName')?.value.trim();
    const description = document.getElementById('productDescription')?.value.trim();
    const price = parseFloat(document.getElementById('productPrice')?.value);
    const stock = parseInt(document.getElementById('productStock')?.value);
    const sellerPhone = document.getElementById('sellerPhone')?.value.trim();
    
    console.log('Form values:', { name, description, price, stock, sellerPhone });
    console.log('Selected categories:', selectedCategories);
    console.log('Uploaded images:', uploadedImages.length);
    
    // Validate all fields
    const errors = [];
    
    if (!name) errors.push('Product Name');
    if (!description) errors.push('Product Description');
    if (!price || price <= 0) errors.push('Valid Price');
    if (!stock || stock <= 0) errors.push('Valid Stock Quantity');
    if (!sellerPhone) errors.push('Contact Phone');
    if (selectedCategories.length === 0) errors.push('At least one Category');
    if (uploadedImages.length === 0) errors.push('At least one Product Image');
    
    if (errors.length > 0) {
        const errorMessage = '⚠️ Please complete the following:\n\n' + errors.map((e, i) => `${i + 1}. ${e}`).join('\n');
        alert(errorMessage);
        console.log('Validation failed:', errors);
        return;
    }
    
    console.log('✅ All validations passed');
    
    // Create product object
    const product = {
        id: Date.now(),
        name: name,
        description: description,
        price: price,
        stock: stock,
        category: selectedCategories.join(', '),
        image: uploadedImages[0],
        imageUrl: uploadedImages[0],
        images: uploadedImages,
        seller: currentUser.name,
        sellerId: currentUser.id,
        sellerPhone: sellerPhone,
        brand: 'Generic',
        condition: 'New',
        warranty: 'No warranty',
        status: 'ACTIVE',
        rating: 0,
        reviews: 0,
        createdAt: new Date().toISOString()
    };
    
    console.log('Product object created:', product);
    
    // Get existing products
    const products = getAllProducts();
    console.log('Existing products count:', products.length);
    
    // Add new product
    products.push(product);
    
    // Save to localStorage with error handling
    const saveSuccess = saveProducts(products);
    
    if (!saveSuccess) {
        console.error('❌ Failed to save product');
        alert('❌ Failed to publish item. Please check console for details.');
        return;
    }
    
    console.log('✅ Product saved! New total:', products.length);
    
    // Verify the save by reading back
    const verifyProducts = getAllProducts();
    const savedProduct = verifyProducts.find(p => p.id === product.id);
    
    if (!savedProduct) {
        console.error('❌ Product save verification failed!');
        alert('⚠️ Product may not have been saved correctly. Please check "My Items".');
    } else {
        console.log('✅ Product save verified:', savedProduct);
    }
    
    // Show success message
    alert('🎉 Success! Your item has been published and will appear in "My Items".');
    showAlert('✅ Item published successfully!', 'success');
    
    // Reset form
    const form = document.getElementById('productForm');
    if (form) form.reset();
    selectedCategories = [];
    uploadedImages = [];
    document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
    displayImages();
    
    // Update stats and lists
    setTimeout(() => {
        updateDashboardStats();
        loadRecentProducts();
        loadMyProducts();
    }, 100);
    
    // Switch to My Items section
    setTimeout(() => {
        document.querySelectorAll('.form-section').forEach(s => s.classList.remove('active'));
        document.getElementById('my-products').classList.add('active');
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        const myItemsMenu = document.querySelector('[data-section="my-products"]');
        if (myItemsMenu) myItemsMenu.classList.add('active');
    }, 500);
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== SELLER DASHBOARD LOADED ===');
    
    // Check localStorage availability
    try {
        const testKey = '__localStorage_test__';
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        console.log('✅ localStorage is available and working');
    } catch (error) {
        console.error('❌ localStorage is not available:', error);
        alert('⚠️ Warning: Browser storage is not available!\n\nThis may be due to:\n- Private/Incognito mode\n- Browser settings\n- Storage quota exceeded\n\nSome features may not work correctly.');
    }
    
    // Check storage usage
    try {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length + key.length;
            }
        }
        const sizeInKB = (totalSize / 1024).toFixed(2);
        const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);
        console.log(`📊 localStorage usage: ${sizeInKB} KB (${sizeInMB} MB)`);
        
        // Warn if storage is getting full (assuming 5MB limit)
        if (totalSize > 4 * 1024 * 1024) {
            console.warn('⚠️ localStorage is nearly full!');
            alert('⚠️ Warning: Browser storage is nearly full!\n\nConsider deleting old products to free up space.');
        }
    } catch (error) {
        console.error('Error checking storage usage:', error);
    }
    
    // Get current user
    currentUser = getCurrentUser();
    console.log('Current user:', currentUser);
    
    // Setup menu navigation
    setupMenuNavigation();
    
    // Setup image upload
    setupImageUpload();
    
    // Setup form submission
    setupFormSubmit();
    
    // Load categories initially (in case add-product section is visible)
    loadCategories();
    
    // Update stats immediately
    updateDashboardStats();
    
    // Load recent products
    loadRecentProducts();
    
    // Load my products
    loadMyProducts();
    
    // Load seller orders
    loadSellerOrders();
    
    // Check for hash navigation (e.g., #add-product)
    const hash = window.location.hash.substring(1); // Remove the #
    if (hash) {
        console.log('Hash detected:', hash);
        
        // Hide all sections
        document.querySelectorAll('.form-section').forEach(s => {
            s.classList.remove('active');
        });
        
        // Show the section from hash
        const targetSection = document.getElementById(hash);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update menu active state
            document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
            const menuItem = document.querySelector(`[data-section="${hash}"]`);
            if (menuItem) {
                menuItem.classList.add('active');
            }
            
            // Load categories if it's add-product section
            if (hash === 'add-product') {
                setTimeout(loadCategories, 100);
            }
            
            // Load orders if it's orders section
            if (hash === 'orders') {
                setTimeout(loadSellerOrders, 100);
            }
        }
    }
    
    // Check if item was just added
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('itemAdded') === 'true') {
        console.log('Item was just added, refreshing stats...');
        
        // Show success message
        showAlert('✅ Item published successfully!', 'success');
        
        // Update stats multiple times to ensure display
        setTimeout(updateDashboardStats, 100);
        setTimeout(updateDashboardStats, 500);
        setTimeout(updateDashboardStats, 1000);
        
        // Clean up URL
        window.history.replaceState({}, document.title, 'seller-dashboard.html');
    }
    
    // Auto-refresh stats and orders every 5 seconds
    setInterval(() => {
        updateDashboardStats();
        
        // Only refresh orders if orders section is active
        const ordersSection = document.getElementById('orders');
        if (ordersSection && ordersSection.classList.contains('active')) {
            loadSellerOrders();
        }
    }, 5000);
    
    console.log('✅ Dashboard initialized successfully');
});

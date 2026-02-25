// IMMEDIATE FIX FOR MY-ITEMS PAGE
// Add this script to my-items.html right after the stats-bar div

(function() {
    console.log('🔧 Running immediate fix for my-items page...');
    
    // Function to update stats
    function updateStatsNow() {
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : { id: 1 };
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            const myProducts = products.filter(p => p.sellerId == user.id);
            
            console.log('📦 User ID:', user.id);
            console.log('📦 Total products in storage:', products.length);
            console.log('📦 My products:', myProducts.length);
            
            // Update stats
            const totalItems = myProducts.length;
            const activeItems = myProducts.filter(p => p.status === 'ACTIVE').length;
            const totalValue = myProducts.reduce((sum, p) => sum + (p.price * p.stock), 0);
            const lowStockItems = myProducts.filter(p => p.stock < 10).length;
            
            const totalElem = document.getElementById('totalItems');
            const activeElem = document.getElementById('activeItems');
            const valueElem = document.getElementById('totalValue');
            const lowStockElem = document.getElementById('lowStockItems');
            
            if (totalElem) totalElem.textContent = totalItems;
            if (activeElem) activeElem.textContent = activeItems;
            if (valueElem) valueElem.textContent = '₹' + totalValue.toFixed(2);
            if (lowStockElem) lowStockElem.textContent = lowStockItems;
            
            console.log('✅ Stats updated:', totalItems, 'items');
            
            // Also display products in grid
            displayProductsNow(myProducts);
            
        } catch (e) {
            console.error('❌ Error updating stats:', e);
        }
    }
    
    // Function to display products
    function displayProductsNow(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) {
            console.log('⚠️ Products grid not found yet');
            return;
        }
        
        if (products.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <h3>No Items Yet</h3>
                    <p>Start by adding your first product!</p>
                    <a href="add-item.html" class="btn-add">➕ Add New Item</a>
                </div>
            `;
            return;
        }
        
        grid.innerHTML = products.map(p => `
            <div class="product-card">
                <img src="${p.imageUrl || 'https://via.placeholder.com/100'}" 
                     alt="${p.name}" 
                     class="product-image"
                     onerror="this.src='https://via.placeholder.com/100'">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p class="product-category">📁 ${p.category || 'General'}</p>
                    <p class="product-description">${p.description || 'No description'}</p>
                    <div class="product-details">
                        <div class="detail-item">
                            <strong>Stock:</strong> ${p.stock} items
                        </div>
                        <div class="detail-item">
                            <strong>Price:</strong> ₹${p.price.toFixed(2)}
                        </div>
                        <div class="detail-item">
                            <strong>Status:</strong> ${p.status || 'ACTIVE'}
                        </div>
                        <div class="detail-item">
                            <strong>Rating:</strong> ⭐ ${p.rating || 0}/5
                        </div>
                    </div>
                    <div class="product-price">₹${p.price.toFixed(2)}</div>
                </div>
                <div class="product-actions">
                    <button class="btn-edit" onclick="editProduct(${p.id})">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteProduct(${p.id})">🗑️ Delete</button>
                </div>
            </div>
        `).join('');
        
        console.log('✅ Displayed', products.length, 'products in grid');
    }
    
    // Run immediately
    updateStatsNow();
    
    // Run again after a short delay
    setTimeout(updateStatsNow, 100);
    setTimeout(updateStatsNow, 500);
    
    // Run every 2 seconds to keep updated
    setInterval(updateStatsNow, 2000);
    
    console.log('✅ My-items fix loaded successfully');
})();

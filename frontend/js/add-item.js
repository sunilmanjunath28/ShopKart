// add-item.js - Handle product publishing

const STORAGE_KEY = 'products'; // Using existing key

// Get current user
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        // Create default user if not exists
        const defaultUser = { id: 1, name: 'Seller', email: 'seller@shopkart.com' };
        localStorage.setItem('user', JSON.stringify(defaultUser));
        return defaultUser;
    }
    return JSON.parse(userStr);
}

// Get all products from localStorage
function getAllProducts() {
    const productsStr = localStorage.getItem(STORAGE_KEY);
    return productsStr ? JSON.parse(productsStr) : [];
}

// Save products to localStorage
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Add Item page loaded');
    
    const currentUser = getCurrentUser();
    console.log('Current user:', currentUser);
    
    // Setup form submission
    const form = document.getElementById('productForm');
    if (form) {
        form.addEventListener('submit', handlePublish);
    }
    
    // Setup category selection
    setupCategorySelection();
    
    // Setup image upload
    setupImageUpload();
});

// Setup category selection
function setupCategorySelection() {
    const categoryOptions = document.querySelectorAll('.category-option');
    let selectedCategories = [];
    
    categoryOptions.forEach(option => {
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
                alert('Maximum 2 categories allowed');
            }
            
            // Update hidden input
            const categoryInput = document.getElementById('productCategory');
            if (categoryInput) {
                categoryInput.value = selectedCategories.join(', ');
            }
            
            // Update counter
            const counter = document.getElementById('categoryCounter');
            if (counter) {
                counter.textContent = `${selectedCategories.length}/2 selected`;
            }
        });
    });
}

// Setup image upload
let uploadedImages = [];

function setupImageUpload() {
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const files = e.target.files;
            
            Array.from(files).forEach(file => {
                if (uploadedImages.length >= 5) {
                    alert('Maximum 5 images allowed');
                    return;
                }
                
                if (file.size > 5 * 1024 * 1024) {
                    alert(`${file.name} is too large (max 5MB)`);
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    uploadedImages.push(e.target.result);
                    displayImages();
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

function displayImages() {
    const preview = document.getElementById('imagePreview');
    if (!preview) return;
    
    preview.innerHTML = uploadedImages.map((img, index) => `
        <div class="preview-item">
            <img src="${img}" alt="Preview">
            <button type="button" class="remove-btn" onclick="removeImage(${index})">×</button>
        </div>
    `).join('');
}

function removeImage(index) {
    uploadedImages.splice(index, 1);
    displayImages();
}

// Handle form submission
async function handlePublish(e) {
    e.preventDefault();
    
    console.log('Publishing product...');
    
    // Get form values
    const name = document.getElementById('productName')?.value.trim();
    const description = document.getElementById('productDescription')?.value.trim();
    const price = parseFloat(document.getElementById('productPrice')?.value);
    const stock = parseInt(document.getElementById('productStock')?.value);
    const category = document.getElementById('productCategory')?.value;
    const sellerPhone = document.getElementById('sellerPhone')?.value.trim();
    const brand = document.getElementById('productBrand')?.value.trim() || 'Generic';
    const condition = document.getElementById('productCondition')?.value || 'New';
    const warranty = document.getElementById('productWarranty')?.value.trim() || 'No warranty';
    
    // Validate
    if (!name) {
        alert('Please enter product name');
        return;
    }
    
    if (!description) {
        alert('Please enter description');
        return;
    }
    
    if (!price || price <= 0) {
        alert('Please enter valid price');
        return;
    }
    
    if (!stock || stock <= 0) {
        alert('Please enter valid stock');
        return;
    }
    
    if (!category) {
        alert('Please select at least one category');
        return;
    }
    
    if (uploadedImages.length === 0) {
        alert('Please upload at least one image');
        return;
    }
    
    if (!sellerPhone) {
        alert('Please enter your contact phone');
        return;
    }
    
    // Get current user
    const currentUser = getCurrentUser();
    
    // Create product object for API
    const product = {
        name: name,
        description: description,
        price: price,
        stock: stock,
        category: category,
        image: uploadedImages[0], // Main image
        images: uploadedImages, // All images
        seller: currentUser.name,
        sellerId: currentUser.id,
        sellerPhone: sellerPhone || currentUser.phone,
        sellerEmail: currentUser.email,
        sellerCity: currentUser.city,
        sellerPincode: currentUser.pincode,
        sellerProfileImage: currentUser.profileImage,
        brand: brand,
        condition: condition,
        warranty: warranty,
        status: 'ACTIVE',
        rating: 0,
        reviews: 0
    };
    
    console.log('Sending product to database...', product);
    
    try {
        const API_URL = 'http://localhost:8080/api';
        const token = localStorage.getItem('token');
        
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });
        
        if (response.ok) {
            const savedProduct = await response.json();
            console.log('✅ Product saved to database! ID:', savedProduct.id);
            alert('✅ Item published successfully!');
            
            // Redirect to seller dashboard
            window.location.href = 'seller-dashboard.html?itemAdded=true';
        } else {
            const error = await response.text();
            console.error('API Error:', error);
            alert('❌ Failed to publish item. Server error: ' + error);
        }
    } catch (error) {
        console.error('Error publishing product:', error);
        alert('❌ Failed to publish item: ' + error.message);
    }
}

// IndexedDB Storage Manager - Supports large storage (GB instead of MB)

class StorageManager {
    constructor() {
        this.dbName = 'ShopKartDB';
        this.dbVersion = 1;
        this.db = null;
    }

    // Initialize IndexedDB
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => {
                console.error('IndexedDB error:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ IndexedDB initialized');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create products store
                if (!db.objectStoreNames.contains('products')) {
                    const productsStore = db.createObjectStore('products', { keyPath: 'id' });
                    productsStore.createIndex('sellerId', 'sellerId', { unique: false });
                    productsStore.createIndex('category', 'category', { unique: false });
                    productsStore.createIndex('status', 'status', { unique: false });
                    console.log('✅ Products store created');
                }

                // Create users store
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'id' });
                    console.log('✅ Users store created');
                }
            };
        });
    }

    // Save product
    async saveProduct(product) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.add(product);

            request.onsuccess = () => {
                console.log('✅ Product saved to IndexedDB:', product.id);
                resolve(product);
            };

            request.onerror = () => {
                console.error('❌ Error saving product:', request.error);
                reject(request.error);
            };
        });
    }

    // Get all products
    async getAllProducts() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const request = store.getAll();

            request.onsuccess = () => {
                console.log('✅ Retrieved', request.result.length, 'products from IndexedDB');
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Error getting products:', request.error);
                reject(request.error);
            };
        });
    }

    // Get products by seller ID
    async getProductsBySeller(sellerId) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readonly');
            const store = transaction.objectStore('products');
            const index = store.index('sellerId');
            const request = index.getAll(sellerId);

            request.onsuccess = () => {
                console.log('✅ Retrieved', request.result.length, 'products for seller', sellerId);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Error getting products by seller:', request.error);
                reject(request.error);
            };
        });
    }

    // Delete product
    async deleteProduct(productId) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.delete(productId);

            request.onsuccess = () => {
                console.log('✅ Product deleted:', productId);
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Error deleting product:', request.error);
                reject(request.error);
            };
        });
    }

    // Clear all products
    async clearAllProducts() {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['products'], 'readwrite');
            const store = transaction.objectStore('products');
            const request = store.clear();

            request.onsuccess = () => {
                console.log('✅ All products cleared');
                resolve();
            };

            request.onerror = () => {
                console.error('❌ Error clearing products:', request.error);
                reject(request.error);
            };
        });
    }

    // Save user
    async saveUser(user) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            const request = store.put(user); // Use put to update if exists

            request.onsuccess = () => {
                console.log('✅ User saved to IndexedDB');
                resolve(user);
            };

            request.onerror = () => {
                console.error('❌ Error saving user:', request.error);
                reject(request.error);
            };
        });
    }

    // Get user
    async getUser(userId) {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(userId);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('❌ Error getting user:', request.error);
                reject(request.error);
            };
        });
    }

    // Migrate from localStorage to IndexedDB
    async migrateFromLocalStorage() {
        console.log('🔄 Migrating data from localStorage to IndexedDB...');

        try {
            // Migrate products
            const productsStr = localStorage.getItem('products');
            if (productsStr) {
                const products = JSON.parse(productsStr);
                console.log('Found', products.length, 'products in localStorage');

                for (const product of products) {
                    try {
                        await this.saveProduct(product);
                    } catch (error) {
                        console.warn('Product already exists:', product.id);
                    }
                }

                console.log('✅ Products migrated successfully');
            }

            // Migrate user
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);
                await this.saveUser(user);
                console.log('✅ User migrated successfully');
            }

            console.log('✅ Migration complete!');
        } catch (error) {
            console.error('❌ Migration error:', error);
        }
    }

    // Get storage estimate
    async getStorageEstimate() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const usage = estimate.usage || 0;
            const quota = estimate.quota || 0;
            const percentUsed = (usage / quota * 100).toFixed(2);

            return {
                usage: (usage / 1024 / 1024).toFixed(2) + ' MB',
                quota: (quota / 1024 / 1024 / 1024).toFixed(2) + ' GB',
                percentUsed: percentUsed + '%',
                usageBytes: usage,
                quotaBytes: quota
            };
        }
        return null;
    }
}

// Create global instance
const storageManager = new StorageManager();

// Initialize on load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await storageManager.init();
        
        // Auto-migrate from localStorage silently (no popup)
        const productsInLocalStorage = localStorage.getItem('products');
        if (productsInLocalStorage) {
            try {
                await storageManager.migrateFromLocalStorage();
                console.log('✅ Data migrated to IndexedDB');
            } catch (error) {
                console.log('Migration skipped or already done');
            }
        }

        // Show storage info in console only
        const estimate = await storageManager.getStorageEstimate();
        if (estimate) {
            console.log('📊 Storage Info:');
            console.log('  Used:', estimate.usage);
            console.log('  Available:', estimate.quota);
            console.log('  Percent Used:', estimate.percentUsed);
        }
    } catch (error) {
        console.error('Storage initialization error:', error);
    }
});

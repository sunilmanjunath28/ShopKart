package com.commerce.ecommerce.config;

import com.commerce.ecommerce.model.Product;
import com.commerce.ecommerce.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepository) {
        return args -> {
            // Only add products if database is empty
            if (productRepository.count() == 0) {
                productRepository.save(createProduct("Wireless Headphones", 2999, 
                    "Premium wireless headphones with noise cancellation", 
                    "https://via.placeholder.com/250x200/2874f0/ffffff?text=Headphones", 50));
                
                productRepository.save(createProduct("Smart Watch", 4999, 
                    "Fitness tracker with heart rate monitor", 
                    "https://via.placeholder.com/250x200/fb641b/ffffff?text=Smart+Watch", 30));
                
                productRepository.save(createProduct("Laptop Backpack", 1299, 
                    "Durable laptop backpack with multiple compartments", 
                    "https://via.placeholder.com/250x200/388e3c/ffffff?text=Backpack", 100));
                
                productRepository.save(createProduct("Bluetooth Speaker", 1999, 
                    "Portable bluetooth speaker with 10 hours battery", 
                    "https://via.placeholder.com/250x200/f57c00/ffffff?text=Speaker", 75));
                
                productRepository.save(createProduct("Phone Case", 499, 
                    "Shockproof phone case with premium finish", 
                    "https://via.placeholder.com/250x200/7b1fa2/ffffff?text=Phone+Case", 200));
                
                productRepository.save(createProduct("USB Cable", 299, 
                    "Fast charging USB Type-C cable", 
                    "https://via.placeholder.com/250x200/c2185b/ffffff?text=USB+Cable", 150));
                
                productRepository.save(createProduct("Wireless Mouse", 799, 
                    "Ergonomic wireless mouse with precision tracking", 
                    "https://via.placeholder.com/250x200/0097a7/ffffff?text=Mouse", 80));
                
                productRepository.save(createProduct("Mechanical Keyboard", 1499, 
                    "RGB mechanical keyboard with blue switches", 
                    "https://via.placeholder.com/250x200/5d4037/ffffff?text=Keyboard", 60));
                
                System.out.println("✅ Demo products initialized successfully!");
            }
        };
    }

    private Product createProduct(String name, double price, String description, String imageUrl, int stock) {
        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setDescription(description);
        product.setImageUrl(imageUrl);
        product.setStock(stock);
        return product;
    }
}

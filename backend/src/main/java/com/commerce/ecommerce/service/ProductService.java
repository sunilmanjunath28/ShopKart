package com.commerce.ecommerce.service;

import com.commerce.ecommerce.model.Product;
import com.commerce.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // Get all products
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Get products by seller
    public List<Product> getProductsBySeller(Long sellerId) {
        return productRepository.findAll().stream()
                .filter(p -> p.getSellerId() != null && p.getSellerId().equals(sellerId))
                .toList();
    }

    // Search products
    public List<Product> searchProducts(String keyword) {
        return productRepository.findAll().stream()
                .filter(p -> p.getName().toLowerCase().contains(keyword.toLowerCase())
                        || p.getDescription().toLowerCase().contains(keyword.toLowerCase())
                        || (p.getCategory() != null && p.getCategory().toLowerCase().contains(keyword.toLowerCase())))
                .filter(p -> "ACTIVE".equals(p.getStatus()) && p.getStock() > 0)
                .toList();
    }

    // Get product by ID
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    // Create product
    public Product createProduct(Product product) {
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        product.setStatus("ACTIVE");
        return productRepository.save(product);
    }

    // Update product
    public Product updateProduct(Long id, Product productDetails) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product p = product.get();
            p.setName(productDetails.getName());
            p.setPrice(productDetails.getPrice());
            p.setDescription(productDetails.getDescription());
            p.setImageUrl(productDetails.getImageUrl());
            p.setImagesJson(productDetails.getImagesJson());
            p.setVideoUrl(productDetails.getVideoUrl());
            p.setStock(productDetails.getStock());
            p.setCategory(productDetails.getCategory());
            p.setUpdatedAt(LocalDateTime.now());
            return productRepository.save(p);
        }
        return null;
    }

    // Delete product
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    // Get active products
    public List<Product> getActiveProducts() {
        return productRepository.findAll().stream()
                .filter(p -> "ACTIVE".equals(p.getStatus()) && p.getStock() > 0)
                .toList();
    }

    // Filter by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findAll().stream()
                .filter(p -> category.equals(p.getCategory()) && "ACTIVE".equals(p.getStatus()))
                .toList();
    }

    public Product addProduct(Product product) {
        return createProduct(product);
    }
}
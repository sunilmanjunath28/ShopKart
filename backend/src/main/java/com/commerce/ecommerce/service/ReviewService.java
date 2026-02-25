package com.commerce.ecommerce.service;

import com.commerce.ecommerce.model.Review;
import com.commerce.ecommerce.model.Product;
import com.commerce.ecommerce.repository.ReviewRepository;
import com.commerce.ecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;
    
    @Autowired
    private ProductRepository productRepository;

    // Create review and update product rating
    public Review createReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        updateProductRating(review.getProductId());
        return savedReview;
    }
    
    // Update product rating based on all reviews
    private void updateProductRating(Long productId) {
        List<Review> reviews = reviewRepository.findByProductId(productId);
        if (!reviews.isEmpty()) {
            double avgRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
            
            productRepository.findById(productId).ifPresent(product -> {
                product.setRating(Math.round(avgRating * 10.0) / 10.0); // Round to 1 decimal
                product.setReviews(reviews.size());
                productRepository.save(product);
            });
        }
    }

    // Get product reviews
    public List<Review> getProductReviews(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    // Get user reviews
    public List<Review> getUserReviews(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    // Delete review
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}

package com.commerce.ecommerce.service;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.commerce.ecommerce.repository.UserRepository;
import com.commerce.ecommerce.model.User;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService() {}

    public User register(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        user.setCreatedAt(LocalDateTime.now());
        user.setWalletBalance(0);
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }

    // Get user by ID
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    // Update user profile (partial updates allowed)
    public User updateUser(Long userId, User userDetails) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            if (userDetails.getName() != null) u.setName(userDetails.getName());
            if (userDetails.getPhone() != null) u.setPhone(userDetails.getPhone());
            if (userDetails.getAddress() != null) u.setAddress(userDetails.getAddress());
            if (userDetails.getCity() != null) u.setCity(userDetails.getCity());
            if (userDetails.getPostalCode() != null) u.setPostalCode(userDetails.getPostalCode());
            if (userDetails.getProfileImage() != null) u.setProfileImage(userDetails.getProfileImage());
            if (userDetails.getBio() != null) u.setBio(userDetails.getBio());
            return userRepository.save(u);
        }
        return null;
    }

    /**
     * Change the password for a user. Returns true if successful or false if
     * the current password does not match or user not found.
     */
    public boolean changePassword(Long userId, String currentPassword, String newPassword) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            if (passwordEncoder.matches(currentPassword, u.getPassword())) {
                u.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(u);
                return true;
            }
        }
        return false;
    }

    // Ban user
    public User banUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            u.setBanned(true);
            return userRepository.save(u);
        }
        return null;
    }

    // Unban user
    public User unbanUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            u.setBanned(false);
            return userRepository.save(u);
        }
        return null;
    }

    // Add to wallet
    public User addToWallet(Long userId, double amount) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            u.setWalletBalance(u.getWalletBalance() + amount);
            return userRepository.save(u);
        }
        return null;
    }

    // Deduct from wallet
    public User deductFromWallet(Long userId, double amount) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            if (u.getWalletBalance() >= amount) {
                u.setWalletBalance(u.getWalletBalance() - amount);
                return userRepository.save(u);
            }
        }
        return null;
    }

    // Update ratings
    public User updateRating(Long userId, double newRating) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            User u = user.get();
            int totalReviews = u.getTotalReviews() + 1;
            double avgRating = (u.getRatings() * u.getTotalReviews() + newRating) / totalReviews;
            u.setRatings(avgRating);
            u.setTotalReviews(totalReviews);
            return userRepository.save(u);
        }
        return null;
    }
}

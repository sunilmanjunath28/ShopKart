package com.commerce.ecommerce.controller;

import com.commerce.ecommerce.model.User;
import com.commerce.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<User> updateUser(@PathVariable Long userId, @RequestBody User userDetails) {
        User updatedUser = userService.updateUser(userId, userDetails);
        if (updatedUser != null) {
            return ResponseEntity.ok(updatedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}/ban")
    public ResponseEntity<User> banUser(@PathVariable Long userId) {
        User bannedUser = userService.banUser(userId);
        if (bannedUser != null) {
            return ResponseEntity.ok(bannedUser);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{userId}/unban")
    public ResponseEntity<User> unbanUser(@PathVariable Long userId) {
        User unbannedUser = userService.unbanUser(userId);
        if (unbannedUser != null) {
            return ResponseEntity.ok(unbannedUser);
        }
        return ResponseEntity.notFound().build();
    }

    // change password endpoint expects JSON with { "currentPassword": "..", "newPassword": ".." }
    @PutMapping("/{userId}/password")
    public ResponseEntity<String> changePassword(@PathVariable Long userId, @RequestBody Map<String,String> body) {
        String current = body.get("currentPassword");
        String next = body.get("newPassword");
        if (current == null || next == null) {
            return ResponseEntity.badRequest().body("Missing password fields");
        }
        boolean ok = userService.changePassword(userId, current, next);
        if (ok) {
            return ResponseEntity.ok("Password changed");
        }
        return ResponseEntity.status(400).body("Current password incorrect or user not found");
    }

    @PostMapping("/{userId}/wallet/add")
    public ResponseEntity<User> addToWallet(@PathVariable Long userId, @RequestParam double amount) {
        User user = userService.addToWallet(userId, amount);
        if (user != null) {
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{userId}/seller-info")
    public ResponseEntity<User> getSellerInfo(@PathVariable Long userId) {
        Optional<User> user = userService.getUserById(userId);
        return user.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}

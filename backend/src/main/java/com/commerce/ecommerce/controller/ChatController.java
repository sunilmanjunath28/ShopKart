package com.commerce.ecommerce.controller;

import com.commerce.ecommerce.model.Chat;
import com.commerce.ecommerce.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping
    public ResponseEntity<Chat> sendMessage(@RequestParam Long senderId, @RequestParam Long receiverId, @RequestBody Map<String, String> body) {
        String message = body.get("message");
        Chat chat = chatService.sendMessage(senderId, receiverId, message);
        return ResponseEntity.ok(chat);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<Chat>> getConversation(@RequestParam Long userId1, @RequestParam Long userId2) {
        return ResponseEntity.ok(chatService.getConversation(userId1, userId2));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Chat>> getUserChats(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUserChats(userId));
    }

    @PutMapping("/{chatId}/read")
    public ResponseEntity<Chat> markAsRead(@PathVariable Long chatId) {
        Chat chat = chatService.markAsRead(chatId);
        if (chat != null) {
            return ResponseEntity.ok(chat);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<Chat>> getUnreadMessages(@PathVariable Long userId) {
        return ResponseEntity.ok(chatService.getUnreadMessages(userId));
    }
}

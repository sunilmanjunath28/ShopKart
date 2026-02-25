package com.commerce.ecommerce.service;

import com.commerce.ecommerce.model.Chat;
import com.commerce.ecommerce.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    // Send message
    public Chat sendMessage(Long senderId, Long receiverId, String message) {
        Chat chat = new Chat(senderId, receiverId, message);
        return chatRepository.save(chat);
    }

    // Get conversation
    public List<Chat> getConversation(Long userId1, Long userId2) {
        List<Chat> messages1 = chatRepository.findBySenderIdAndReceiverId(userId1, userId2);
        List<Chat> messages2 = chatRepository.findBySenderIdAndReceiverId(userId2, userId1);
        messages1.addAll(messages2);
        return messages1.stream()
                .sorted((m1, m2) -> m1.getCreatedAt().compareTo(m2.getCreatedAt()))
                .toList();
    }

    // Get user chats
    public List<Chat> getUserChats(Long userId) {
        return chatRepository.findBySenderIdOrReceiverId(userId, userId);
    }

    // Mark as read
    public Chat markAsRead(Long chatId) {
        Chat chat = chatRepository.findById(chatId).orElse(null);
        if (chat != null) {
            chat.setRead(true);
            return chatRepository.save(chat);
        }
        return null;
    }

    // Get unread messages
    public List<Chat> getUnreadMessages(Long userId) {
        return chatRepository.findByReceiverIdAndIsRead(userId, false);
    }
}

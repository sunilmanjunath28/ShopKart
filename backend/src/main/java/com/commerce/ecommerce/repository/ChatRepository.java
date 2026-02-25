package com.commerce.ecommerce.repository;

import com.commerce.ecommerce.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<Chat, Long> {
    List<Chat> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
    List<Chat> findBySenderIdAndReceiverId(Long senderId, Long receiverId);
    List<Chat> findByReceiverIdAndIsRead(Long receiverId, boolean isRead);
}

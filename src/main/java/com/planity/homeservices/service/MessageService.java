package com.planity.homeservices.service;

import com.planity.homeservices.model.Message;
import com.planity.homeservices.repository.MessageRepository;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Map<String, Object>> getConversations(Long currentUserId) {
        // Récupérer tous les messages envoyés et reçus
        List<Message> allMessages = messageRepository.findBySenderIdOrReceiverId(currentUserId, currentUserId);

        // Grouper les messages par conversation
        Map<Long, List<Message>> conversations = allMessages.stream()
            .collect(Collectors.groupingBy(m -> 
                m.getSenderId().equals(currentUserId) ? m.getReceiverId() : m.getSenderId()
            ));

        // Créer la liste des conversations avec les informations nécessaires
        List<Map<String, Object>> conversationList = conversations.entrySet().stream()
            .map(entry -> {
                Long otherUserId = entry.getKey();
                List<Message> messages = entry.getValue();
                Message lastMessage = messages.stream()
                    .max(Comparator.comparing(Message::getCreatedAt))
                    .orElse(null);

                Map<String, Object> conversation = new HashMap<>();
                conversation.put("id", otherUserId);
                conversation.put("username", userRepository.findById(otherUserId)
                    .orElseThrow(() -> new RuntimeException("User not found"))
                    .getUsername());
                conversation.put("lastMessage", lastMessage != null ? lastMessage.getContent() : "");
                conversation.put("lastMessageDate", lastMessage != null ? lastMessage.getCreatedAt() : LocalDateTime.now());
                return conversation;
            })
            .collect(Collectors.toList());

        // Trier les conversations par date du dernier message
        conversationList.sort((a, b) -> {
            LocalDateTime dateA = (LocalDateTime) a.get("lastMessageDate");
            LocalDateTime dateB = (LocalDateTime) b.get("lastMessageDate");
            return dateB.compareTo(dateA);
        });

        return conversationList;
    }

    public List<Message> getConversation(Long currentUserId, Long otherUserId) {
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(currentUserId, otherUserId);
    }

    public Message sendMessage(Message message) {
        Long currentUserId = message.getSenderId();
        message.setCreatedAt(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public Message saveMessage(Long senderId, Long receiverId, String content) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        return messageRepository.save(message);
    }

    public List<Message> getUserMessages(Long userId) {
        return messageRepository.findBySenderIdOrReceiverId(userId, userId);
    }
} 
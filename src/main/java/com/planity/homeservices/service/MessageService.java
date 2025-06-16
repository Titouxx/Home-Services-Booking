package com.planity.homeservices.service;

import com.planity.homeservices.model.Message;
import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.MessageRepository;
import com.planity.homeservices.repository.ReservationRepository;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    public List<Map<String, Object>> getConversations(Long currentUserId) {
        List<Message> allMessages = messageRepository.findBySenderIdOrReceiverId(currentUserId, currentUserId);
        
        List<Reservation> allReservations = reservationRepository.findByUserIdOrProviderId(currentUserId);
        
        Set<Long> conversationPartners = new HashSet<>();
        
        allMessages.forEach(m -> {
            if (m.getSenderId().equals(currentUserId)) {
                conversationPartners.add(m.getReceiverId());
            } else {
                conversationPartners.add(m.getSenderId());
            }
        });
        
        allReservations.forEach(r -> {
            if (r.getUser().getId().equals(currentUserId)) {
                conversationPartners.add(r.getProviderId());
            } else {
                conversationPartners.add(r.getUser().getId());
            }
        });
        
        List<Map<String, Object>> conversationList = new ArrayList<>();
        
        for (Long partnerId : conversationPartners) {
            Optional<User> partnerOpt = userRepository.findById(partnerId);
            if (partnerOpt.isEmpty()) continue;
            
            User partner = partnerOpt.get();
            Map<String, Object> conversation = new HashMap<>();
            conversation.put("id", partner.getId());
            conversation.put("username", partner.getUsername());
            conversation.put("firstName", partner.getFirstName());
            conversation.put("lastName", partner.getLastName());
            
            List<Message> messages = messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
                currentUserId, partnerId);
            
            if (!messages.isEmpty()) {
                Message lastMessage = messages.stream()
                    .max(Comparator.comparing(Message::getCreatedAt))
                    .orElse(null);
                
                conversation.put("lastMessage", lastMessage != null ? lastMessage.getContent() : "");
                conversation.put("lastMessageDate", lastMessage != null ? lastMessage.getCreatedAt() : LocalDateTime.now());
                conversation.put("unreadCount", messages.stream()
                    .filter(m -> !m.getIsRead() && m.getSenderId().equals(partnerId))
                    .count());
            } else {
                Optional<Reservation> latestReservation = allReservations.stream()
                    .filter(r -> r.getUser().getId().equals(partnerId) || 
                               r.getProviderId().equals(partnerId))
                    .max(Comparator.comparing(Reservation::getAppointmentDate));
                
                if (latestReservation.isPresent()) {
                    conversation.put("lastMessage", "Reservation: " + latestReservation.get().getService().getName());
                    conversation.put("lastMessageDate", latestReservation.get().getAppointmentDate());
                } else {
                    conversation.put("lastMessage", "New conversation");
                    conversation.put("lastMessageDate", LocalDateTime.now());
                }
                conversation.put("unreadCount", 0);
            }
            
            conversationList.add(conversation);
        }
        
        conversationList.sort((a, b) -> 
            ((LocalDateTime) b.get("lastMessageDate"))
                .compareTo((LocalDateTime) a.get("lastMessageDate")));
        
        return conversationList;
    }

    public List<Message> getConversation(Long currentUserId, Long otherUserId) {
        List<Message> unreadMessages = messageRepository.findByReceiverIdAndSenderIdAndIsReadFalse(
            currentUserId, otherUserId);
        
        if (!unreadMessages.isEmpty()) {
            unreadMessages.forEach(m -> m.setIsRead(true));
            messageRepository.saveAll(unreadMessages);
        }
        
        return messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
            currentUserId, otherUserId);
    }

    public Message saveMessage(Long senderId, Long receiverId, String content) {
        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        return messageRepository.save(message);
    }

    public long getUnreadMessageCount(Long userId) {
        return messageRepository.countByReceiverIdAndIsReadFalse(userId);
    }
}
package com.planity.homeservices.repository;

import com.planity.homeservices.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :senderId AND m.receiverId = :receiverId) OR " +
           "(m.senderId = :receiverId AND m.receiverId = :senderId) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
        @Param("senderId") Long senderId,
        @Param("receiverId") Long receiverId
    );

    @Query("SELECT m FROM Message m WHERE m.senderId = :userId OR m.receiverId = :userId")
    List<Message> findBySenderIdOrReceiverId(
        @Param("userId") Long userId1,
        @Param("userId") Long userId2
    );

    @Query("SELECT DISTINCT CASE WHEN m.senderId = :userId THEN m.receiverId ELSE m.senderId END as otherUserId " +
           "FROM Message m WHERE m.senderId = :userId OR m.receiverId = :userId")
    List<Long> findConversationPartnersByUserId(@Param("userId") Long userId);

    @Query("SELECT m FROM Message m WHERE m.receiverId = :receiverId AND m.senderId = :senderId AND m.isRead = false")
    List<Message> findByReceiverIdAndSenderIdAndIsReadFalse(
        @Param("receiverId") Long receiverId,
        @Param("senderId") Long senderId
    );

    @Query("SELECT COUNT(m) FROM Message m WHERE m.receiverId = :userId AND m.isRead = false")
    long countByReceiverIdAndIsReadFalse(@Param("userId") Long userId);
}
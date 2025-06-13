package com.planity.homeservices.repository;

import com.planity.homeservices.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
        Long sender1, Long receiver1, Long sender2, Long receiver2
    );
}

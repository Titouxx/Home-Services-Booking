package com.planity.homeservices.controller;

import com.planity.homeservices.dto.MessageRequest;
import com.planity.homeservices.model.Message;
import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.MessageRepository;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageController(MessageRepository messageRepository, UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest request) {
        User sender = userRepository.findById(request.getSenderId()).orElseThrow();
        User receiver = userRepository.findById(request.getReceiverId()).orElseThrow();

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(request.getContent());

        return ResponseEntity.ok(messageRepository.save(message));
    }

    @GetMapping("/{user1Id}/{user2Id}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long user1Id, @PathVariable Long user2Id) {
        List<Message> conversation = messageRepository.findBySenderIdAndReceiverIdOrReceiverIdAndSenderId(
            user1Id, user2Id, user1Id, user2Id
        );
        return ResponseEntity.ok(conversation);
    }
}

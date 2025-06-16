package com.planity.homeservices.controller;

import com.planity.homeservices.dto.MessageRequest;
import com.planity.homeservices.model.Message;
import com.planity.homeservices.model.User;
import com.planity.homeservices.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @GetMapping("/conversations")
    public ResponseEntity<List<Map<String, Object>>> getConversations(HttpSession session) {
        User me = (User) session.getAttribute("user");
        if (me == null) {
            return ResponseEntity.status(401).body(List.of());
        }
        return ResponseEntity.ok(messageService.getConversations(me.getId()));
    }

    @GetMapping("/conversation/{otherUserId}")
    public ResponseEntity<?> getConversation(@PathVariable Long otherUserId, HttpSession session) {
        User me = (User) session.getAttribute("user");
        if (me == null) {
            return ResponseEntity.status(401).body(List.of());
        }
        return ResponseEntity.ok(messageService.getConversation(me.getId(), otherUserId));
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody MessageRequest req, HttpSession session) {
        User me = (User) session.getAttribute("user");
        if (me == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        if (req.getContent() == null || req.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Message content cannot be empty"));
        }
        if (req.getReceiverId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Receiver ID is required"));
        }
        Message saved = messageService.saveMessage(me.getId(), req.getReceiverId(), req.getContent());
        return ResponseEntity.ok(saved);
    }
}
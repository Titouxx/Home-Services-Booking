package com.planity.homeservices.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.planity.homeservices.dto.ReviewRequest;
import com.planity.homeservices.model.Review;
import com.planity.homeservices.model.User;
import com.planity.homeservices.service.ReviewService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Get all providers
    @GetMapping("/providers")
    public ResponseEntity<List<User>> getAllProviders() {
        return ResponseEntity.ok(reviewService.getAllProviders());
    }

    // Get reviews for a specific provider
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Review>> getReviewsForProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(reviewService.getReviewsForProvider(providerId));
    }

    // Submit a new review
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest req, HttpSession session) {
        User me = (User) session.getAttribute("user");
        if (me == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        if (!"client".equals(me.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("error", "Only clients can leave reviews"));
        }
        return ResponseEntity.ok(reviewService.createReview(
            me.getId(),
            req.getProviderId(),
            req.getRating(),
            req.getComment()
        ));
    }

    @GetMapping
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id, HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not logged in"));
        }
        if (!"administrateur".equals(user.getStatus())) {
            return ResponseEntity.status(403).body(Map.of("error", "Only admins can delete reviews"));
        }
        
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok().body("Review deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
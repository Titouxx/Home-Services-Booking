package com.planity.homeservices.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.planity.homeservices.dto.ReviewRequest;
import com.planity.homeservices.model.Review;
import com.planity.homeservices.repository.ReviewRepository;
import com.planity.homeservices.repository.ServiceRepository;
import com.planity.homeservices.repository.UserRepository;


@RestController
@RequestMapping("/api/reviews")
@CrossOrigin
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ServiceRepository serviceRepository;
    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest req) {
        Review review = new Review();
        review.setRating(req.getRating());
        review.setComment(req.getComment());

        review.setUser(userRepository.findById(req.getUserId()).orElseThrow());
        review.setProvider(userRepository.findById(req.getProviderId()).orElse(null));
        review.setService(serviceRepository.findById(req.getServiceId()).orElse(null));

        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @GetMapping("/service/{id}")
    public List<Review> getReviewsForService(@PathVariable Long id) {
        return reviewRepository.findByServiceId(id);
    }

    @GetMapping("/provider/{id}")
    public List<Review> getReviewsForProvider(@PathVariable Long id) {
        return reviewRepository.findByProviderId(id);
    }
}

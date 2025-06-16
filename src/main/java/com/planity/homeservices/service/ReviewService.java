package com.planity.homeservices.service;

import com.planity.homeservices.model.Review;
import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.ReviewRepository;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllProviders() {
        return userRepository.findByStatus("prestataire");
    }

    public List<Review> getReviewsForProvider(Long providerId) {
        return reviewRepository.findByProviderId(providerId);
    }

    public Review createReview(Long userId, Long providerId, int rating, String comment) {
        Review review = new Review();
        review.setUser(userRepository.findById(userId).orElseThrow());
        review.setProvider(userRepository.findById(providerId).orElseThrow());
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
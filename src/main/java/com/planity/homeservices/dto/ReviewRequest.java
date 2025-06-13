package com.planity.homeservices.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    private int rating;
    private String comment;
    private Long userId;
    private Long providerId;
    private Long serviceId;
}

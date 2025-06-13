package com.planity.homeservices.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageRequest {
    private Long senderId;
    private Long receiverId;
    private String content;
}

package com.planity.homeservices.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    private Service service;

    @ManyToOne
    private User provider;

    @ManyToOne
    private User user; // le client qui laisse l'avis
}

package com.planity.homeservices.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime appointmentDate;

    @ManyToOne(fetch = FetchType.EAGER)
    private Service service;

    @Column(name = "custom_name")
    private String customName;

    @Column(name = "custom_duration")
    private Integer customDuration;

    @Column(name = "custom_price")
    private BigDecimal customPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    private User user;
}

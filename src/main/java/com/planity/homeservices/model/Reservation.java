package com.planity.homeservices.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(
        name = "reservation",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"service_id", "appointmentDate", "providerId"})
        }
)
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime appointmentDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    @Column(name = "custom_name")
    private String customName;

    @Column(name = "custom_duration")
    private Integer customDuration;

    @Column(name = "custom_price")
    private BigDecimal customPrice;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "providerId", nullable = false)
    private Long providerId;

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }
}

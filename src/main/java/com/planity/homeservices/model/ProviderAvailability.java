package com.planity.homeservices.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "provider_availability")
public class ProviderAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long providerId;
    private LocalDateTime availableDate;

    // Getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProviderId() { return providerId; }
    public void setProviderId(Long providerId) { this.providerId = providerId; }

    public LocalDateTime getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDateTime availableDate) { this.availableDate = availableDate; }
} 
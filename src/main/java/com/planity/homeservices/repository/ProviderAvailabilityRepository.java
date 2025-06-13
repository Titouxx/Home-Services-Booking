package com.planity.homeservices.repository;

import com.planity.homeservices.model.ProviderAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProviderAvailabilityRepository extends JpaRepository<ProviderAvailability, Long> {
    List<ProviderAvailability> findByProviderId(Long providerId);
    List<ProviderAvailability> findByServiceName(String serviceName);
} 
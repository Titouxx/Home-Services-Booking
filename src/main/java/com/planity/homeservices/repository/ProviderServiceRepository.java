package com.planity.homeservices.repository;

import com.planity.homeservices.model.ProviderService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProviderServiceRepository extends JpaRepository<ProviderService, Long> {
    @Modifying
    @Query("DELETE FROM ProviderService ps WHERE ps.providerId = :providerId")
    void deleteByProviderId(@Param("providerId") Long providerId);

    List<ProviderService> findByProviderId(Long providerId);
} 
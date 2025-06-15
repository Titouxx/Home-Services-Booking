package com.planity.homeservices.repository;

import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    List<Reservation> findByServiceId(Long serviceId);
    
    boolean existsByServiceAndAppointmentDateAndProviderId(
        Service service, 
        LocalDateTime appointmentDate, 
        Long providerId
    );
}
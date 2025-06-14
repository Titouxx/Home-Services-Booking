package com.planity.homeservices.repository;

import com.planity.homeservices.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;
import com.planity.homeservices.model.Service;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long userId);
    boolean existsByServiceAndAppointmentDate(Service service, LocalDateTime appointmentDate);
    List<Reservation> findByServiceId(Long serviceId);
}
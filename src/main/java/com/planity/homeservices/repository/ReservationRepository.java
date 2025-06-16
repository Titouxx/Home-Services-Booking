package com.planity.homeservices.repository;

import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.Service;
import com.planity.homeservices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user JOIN FETCH r.service WHERE r.user.id = :userId")
    List<Reservation> findByUserId(@Param("userId") Long userId);

    @Query("SELECT r FROM Reservation r JOIN FETCH r.user JOIN FETCH r.service WHERE r.service.id = :serviceId")
    List<Reservation> findByServiceId(@Param("serviceId") Long serviceId);

    @Query("SELECT r FROM Reservation r JOIN FETCH r.user JOIN FETCH r.service WHERE r.providerId = :providerId")
    List<Reservation> findByProviderId(@Param("providerId") Long providerId);

    @Query("SELECT r FROM Reservation r JOIN FETCH r.user JOIN FETCH r.service " +
           "WHERE r.user.id = :userId OR r.providerId = :userId")
    List<Reservation> findByUserIdOrProviderId(@Param("userId") Long userId);

    boolean existsByServiceAndAppointmentDateAndProviderId(
        Service service,
        LocalDateTime appointmentDate,
        Long providerId
    );

    @Query("SELECT DISTINCT u FROM User u WHERE u.id IN " +
           "(SELECT DISTINCT r.providerId FROM Reservation r WHERE r.user.id = :userId)")
    List<User> findProvidersByUserId(@Param("userId") Long userId);

    @Query("SELECT DISTINCT s.name FROM Reservation r JOIN r.service s " +
           "WHERE r.user.id = :userId AND r.providerId = :providerId")
    List<String> findServiceNamesByUserIdAndProviderId(@Param("userId") Long userId, @Param("providerId") Long providerId);
}
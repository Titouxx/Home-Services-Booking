package com.planity.homeservices.repository;

import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.Service;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Trouve les réservations pour un utilisateur donné et charge immédiatement les entités
     * User et Service associées pour éviter une LazyInitializationException.
     * C'est la correction principale pour l'erreur 500.
     * @param userId L'ID de l'utilisateur.
     * @return Une liste de réservations avec tous les détails chargés.
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user JOIN FETCH r.service WHERE r.user.id = :userId")
    List<Reservation> findByUserId(@Param("userId") Long userId);

    /**
     * Trouve les réservations pour un service donné et charge immédiatement les entités associées.
     * @param serviceId L'ID du service.
     * @return Une liste de réservations avec tous les détails chargés.
     */
    @Query("SELECT r FROM Reservation r JOIN FETCH r.user JOIN FETCH r.service WHERE r.service.id = :serviceId")
    List<Reservation> findByServiceId(@Param("serviceId") Long serviceId);

    /**
     * Vérifie si un créneau horaire est déjà réservé pour un service et un prestataire donnés.
     * Cette méthode n'a pas besoin de modification.
     */
    boolean existsByServiceAndAppointmentDateAndProviderId(
        Service service,
        LocalDateTime appointmentDate,
        Long providerId
    );
}
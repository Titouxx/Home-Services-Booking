package com.planity.homeservices.controller;

import com.planity.homeservices.dto.ReservationRequest;
import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.Service;
import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.ReservationRepository;
import com.planity.homeservices.repository.ServiceRepository;
import com.planity.homeservices.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public ReservationController(ReservationRepository reservationRepository, ServiceRepository serviceRepository, UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        Optional<Service> serviceOpt = serviceRepository.findById(request.getServiceId());
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (serviceOpt.isEmpty() || userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Service or user not found");
        }

        if (reservationRepository.existsByServiceAndAppointmentDateAndProviderId(serviceOpt.get(), request.getAppointmentDate(), request.getProviderId())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("This slot is already booked.");
        }


        Reservation reservation = new Reservation();
        reservation.setService(serviceOpt.get());
        reservation.setUser(userOpt.get());
        reservation.setAppointmentDate(request.getAppointmentDate());
        reservation.setProviderId(request.getProviderId());

        if (request.getCustomName() != null) {
            reservation.setCustomName(request.getCustomName());
            reservation.setCustomDuration(request.getCustomDuration());
            reservation.setCustomPrice(request.getCustomPrice());
        }

        return ResponseEntity.ok(reservationRepository.save(reservation));
    }

    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            if (!reservationRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Reservation not found"));
            }
            
            reservationRepository.deleteById(id);
            
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete reservation: " + e.getMessage()));
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationRepository.findByUserId(userId));
    }

    @GetMapping("/by-service/{serviceId}")
    public ResponseEntity<?> getReservationsByService(@PathVariable Long serviceId) {
        return ResponseEntity.ok(reservationRepository.findByServiceId(serviceId));
    }
}

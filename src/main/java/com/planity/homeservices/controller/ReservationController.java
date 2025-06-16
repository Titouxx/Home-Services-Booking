package com.planity.homeservices.controller;

import com.planity.homeservices.dto.ReservationRequest;
import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.Service;
import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.ReservationRepository;
import com.planity.homeservices.repository.ServiceRepository;
import com.planity.homeservices.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ServiceRepository serviceRepository;
    private final UserRepository userRepository;

    public ReservationController(ReservationRepository reservationRepository,
                               ServiceRepository serviceRepository,
                               UserRepository userRepository) {
        this.reservationRepository = reservationRepository;
        this.serviceRepository = serviceRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        try {
            Optional<Service> serviceOpt = serviceRepository.findById(request.getServiceId());
            Optional<User> userOpt = userRepository.findById(request.getUserId());
            
            if (serviceOpt.isEmpty() || userOpt.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Service or user not found"));
            }

            if (reservationRepository.existsByServiceAndAppointmentDateAndProviderId(
                serviceOpt.get(), request.getAppointmentDate(), request.getProviderId())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "This time slot is already booked"));
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

            Reservation savedReservation = reservationRepository.save(reservation);
            return ResponseEntity.ok(savedReservation);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to create reservation: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllReservations() {
        try {
            List<Reservation> reservations = reservationRepository.findAllWithDetails();
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch reservations: " + e.getMessage()));
        }
    }

    @GetMapping("/by-user/current")
    public ResponseEntity<?> getCurrentUserReservations(HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
            }
            
            List<Reservation> reservations = reservationRepository.findByUserId(user.getId());
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch user reservations: " + e.getMessage()));
        }
    }

    @GetMapping("/by-user/{userId}")
    public ResponseEntity<?> getReservationsByUser(@PathVariable Long userId) {
        try {
            List<Reservation> reservations = reservationRepository.findByUserId(userId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch reservations: " + e.getMessage()));
        }
    }

    @GetMapping("/by-service/{serviceId}")
    public ResponseEntity<?> getReservationsByService(@PathVariable Long serviceId) {
        try {
            List<Reservation> reservations = reservationRepository.findByServiceId(serviceId);
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch service reservations: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReservation(@PathVariable Long id) {
        try {
            if (!reservationRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Reservation not found"));
            }
            
            reservationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete reservation: " + e.getMessage()));
        }
    }

    @GetMapping("/by-provider/current")
    public ResponseEntity<?> getCurrentProviderReservations(HttpSession session) {
        try {
            User user = (User) session.getAttribute("user");
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not authenticated"));
            }
            
            List<Reservation> reservations = reservationRepository.findByProviderId(user.getId());
            return ResponseEntity.ok(reservations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to fetch provider reservations: " + e.getMessage()));
        }
    }
}
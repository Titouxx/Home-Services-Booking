package com.planity.homeservices.controller;

import com.planity.homeservices.dto.ReservationRequest;
import com.planity.homeservices.model.Reservation;
import com.planity.homeservices.model.Service;
import com.planity.homeservices.repository.ReservationRepository;
import com.planity.homeservices.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin
public class ReservationController {

    private final ReservationRepository reservationRepository;
    private final ServiceRepository serviceRepository;

    public ReservationController(ReservationRepository reservationRepository, ServiceRepository serviceRepository) {
        this.reservationRepository = reservationRepository;
        this.serviceRepository = serviceRepository;
    }

    @PostMapping
    public ResponseEntity<?> createReservation(@RequestBody ReservationRequest request) {
        Optional<Service> serviceOpt = serviceRepository.findById(request.getServiceId());
        if (serviceOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Service not found");
        }

        Reservation reservation = new Reservation();
        reservation.setService(serviceOpt.get());
        reservation.setAppointmentDate(request.getAppointmentDate());

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
}

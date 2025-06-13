package com.planity.homeservices.controller;

import java.util.List;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.planity.homeservices.model.SubService;
import com.planity.homeservices.repository.SubServiceRepository;

@RestController
@RequestMapping("/api/subservices")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SubServiceController {

    private final SubServiceRepository repository;

    public SubServiceController(SubServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<SubService>> getSubServicesByServiceId(
            @RequestParam Long serviceId,
            HttpSession session) {

        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non connecté");
        }

        List<SubService> subs = repository
                .findTop3ByServiceIdOrderByIdAsc(serviceId);

        return ResponseEntity.ok(subs);
    }
}

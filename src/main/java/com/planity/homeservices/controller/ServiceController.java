package com.planity.homeservices.controller;

import com.planity.homeservices.model.Service;
import com.planity.homeservices.repository.ServiceRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ServiceController {

    private final ServiceRepository repository;

    @Autowired
    public ServiceController(ServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public ResponseEntity<List<Service>> getAllServices(HttpSession session) {
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non connecté");
        }
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id, HttpSession session) {
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non connecté");
        }
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

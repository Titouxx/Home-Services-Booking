package com.planity.homeservices.controller;

import com.planity.homeservices.model.Service;
import com.planity.homeservices.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Use exact origin for dev; use "*" only temporarily
public class ServiceController {

    private final ServiceRepository repository;

    @Autowired
    public ServiceController(ServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Service> getAllServices() {
        return repository.findAll();
    }
}

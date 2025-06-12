package com.planity.homeservices.controller;

import com.planity.homeservices.model.Service;
import com.planity.homeservices.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "http://localhost:5173")
public class ServiceController {

    private final ServiceRepository repository;

    public ServiceController(ServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Service> getAllServices() {
        return repository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        return repository.findById(id)
               .map(ResponseEntity::ok)
               .orElse(ResponseEntity.notFound().build());
    }

    @Controller
    public static class FrontendController {
        @RequestMapping(value = {
            "/",
            "/services/{id:[0-9]+}",
            "/login",
            "/profile"
        })
        public String forwardToIndex() {
            return "forward:/index.html";
        }
    }
}
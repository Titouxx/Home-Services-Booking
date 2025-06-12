package com.planity.homeservices.controller;

import com.planity.homeservices.model.Service;
import com.planity.homeservices.repository.ServiceRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Controller;

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

    // Récupération de tous les services, accessible uniquement si connecté
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices(HttpSession session) {
        Boolean loggedIn = (Boolean) session.getAttribute("logged_in");
        if (loggedIn == null || !loggedIn) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Non connecté");
        }
        List<Service> services = repository.findAll();
        return ResponseEntity.ok(services);
    }

    // Récupération d’un service par ID, accessible uniquement si connecté
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

    /**
     * Forward toutes les autres routes prises en charge par React Router
     * vers index.html afin de laisser le front gérer le routage.
     */
    @Controller
    public static class FrontendController {
        @RequestMapping(value = {
                "/",
                "/services/{id:[0-9]+}",
                "/login",
                "/register",
                "/terms",
                "/basket",
                "/provider-dashboard",
                "/profile"
        })
        public String forwardToIndex() {
            return "forward:/index.html";
        }
    }
}
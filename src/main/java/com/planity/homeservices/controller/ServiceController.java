package com.planity.homeservices.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @GetMapping
    public List<String> getAllServices() {
        return List.of("Plomberie", "Électricité", "Ménage");
    }
}

package com.planity.homeservices.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.planity.homeservices.model.SubService;
import com.planity.homeservices.repository.SubServiceRepository;

@RestController
@RequestMapping("/api/subservices")
@CrossOrigin(origins = "http://localhost:5173")
public class SubServiceController {

    private final SubServiceRepository repository;

    public SubServiceController(SubServiceRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<SubService> getSubServicesByServiceId(@RequestParam Long serviceId) {
        return repository.findTop3ByServiceIdOrderByIdAsc(serviceId);
    }

}


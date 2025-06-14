package com.planity.homeservices.controller;

import com.planity.homeservices.model.ProviderAvailability;
import com.planity.homeservices.repository.ProviderAvailabilityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Transactional
public class ProviderAvailabilityController {

    @Autowired
    private ProviderAvailabilityRepository providerAvailabilityRepository;

    @GetMapping("/availability")
    public ResponseEntity<List<ProviderAvailability>> getProviderAvailability(@RequestParam Long providerId) {
        return ResponseEntity.ok(providerAvailabilityRepository.findByProviderId(providerId));
    }

    @PostMapping("/availability")
    public ResponseEntity<?> addAvailability(@RequestBody Map<String, Object> body) {
        Long providerId = Long.valueOf(body.get("providerId").toString());
        String dateStr = body.get("date").toString();
        String serviceName = body.get("serviceName").toString();
        // Enlève le Z si présent
        if (dateStr.endsWith("Z")) {
            dateStr = dateStr.replace("Z", "");
        }
        LocalDateTime date = LocalDateTime.parse(dateStr);

        ProviderAvailability pa = new ProviderAvailability();
        pa.setProviderId(providerId);
        pa.setAvailableDate(date);
        pa.setServiceName(serviceName);

        providerAvailabilityRepository.save(pa);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/availability/by-service")
    public ResponseEntity<List<ProviderAvailability>> getByService(@RequestParam String serviceName) {
        return ResponseEntity.ok(providerAvailabilityRepository.findByServiceName(serviceName));
    }

    @GetMapping("/availability/all")
    public ResponseEntity<List<ProviderAvailability>> getAllAvailabilities() {
        return ResponseEntity.ok(providerAvailabilityRepository.findAll());
    }

} 
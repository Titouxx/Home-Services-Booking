package com.planity.homeservices.controller;

import com.planity.homeservices.model.ProviderService;
import com.planity.homeservices.repository.ProviderServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Transactional
public class ProviderServiceController {

    @Autowired
    private ProviderServiceRepository providerServiceRepository;

    @GetMapping("/services")
    public ResponseEntity<List<ProviderService>> getProviderServices(@RequestParam Long providerId) {
        return ResponseEntity.ok(providerServiceRepository.findByProviderId(providerId));
    }

    @PostMapping("/services")
    public ResponseEntity<?> saveProviderServices(@RequestBody Map<String, Object> body) {
        Long providerId = Long.valueOf(body.get("providerId").toString());
        List<?> serviceNamesRaw = (List<?>) body.get("serviceNames");
        List<String> serviceNames = serviceNamesRaw.stream().map(Object::toString).toList();

        providerServiceRepository.deleteByProviderId(providerId);

        for (String name : serviceNames) {
            ProviderService ps = new ProviderService();
            ps.setProviderId(providerId);
            ps.setServiceName(name);
            providerServiceRepository.save(ps);
        }
        return ResponseEntity.ok().build();
    }
} 
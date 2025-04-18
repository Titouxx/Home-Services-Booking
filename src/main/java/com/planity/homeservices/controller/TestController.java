package com.planity.homeservices.controller; // Vérifiez ce package !

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test") // Doit correspondre à l'URL appelée
public class TestController {

    @GetMapping // Nécessaire pour les requêtes GET
    public String testConnection() {
        return "API test working!";
    }
}
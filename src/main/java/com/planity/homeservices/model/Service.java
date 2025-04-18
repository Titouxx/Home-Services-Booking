// src/main/java/com/planity/homeservices/model/Service.java
package com.planity.homeservices.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor // Lombok pour éviter le code boilerplate
public class Service {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title; // "Plomberie", "Électricité", etc.
    private String description;
    private double basePrice; // Prix de base du service
}
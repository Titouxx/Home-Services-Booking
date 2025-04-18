package com.planity.homeservices.model;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String role; // CLIENT, PROVIDER, ADMIN

    // relations avec d'autres entités...
    // Dans User.java
    @OneToMany(mappedBy = "provider", cascade = CascadeType.ALL)
    private List<Service> offeredServices;

    // Constructeurs, getters/setters
}

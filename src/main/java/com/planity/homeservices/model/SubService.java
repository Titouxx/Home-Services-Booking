package com.planity.homeservices.model;

import java.math.BigDecimal;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "\"subservices\"")
@Getter
@Setter
public class SubService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private BigDecimal price;
    private int duration_minutes;
    private String description;

    @ManyToOne
    @JoinColumn(name = "service", referencedColumnName = "id")
    private Service service;
}

package com.planity.homeservices.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.planity.homeservices.model.TestEntity; // À créer aussi

public interface TestRepository extends JpaRepository<TestEntity, Long> {
}
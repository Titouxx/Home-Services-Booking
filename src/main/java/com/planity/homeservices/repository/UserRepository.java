package com.planity.homeservices.repository;

import com.planity.homeservices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Méthode pour trouver un user par son username
    User findByUsername(String username);
}


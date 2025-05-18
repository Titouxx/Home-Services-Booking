package com.planity.homeservices.repository;

import com.planity.homeservices.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // ou findByEmail si c'est ce que tu utilises dans User
}
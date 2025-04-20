package com.planity.homeservices.service;

import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User authenticate(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    // Ex: Méthode pour créer un nouvel utilisateur
    public User registerUser(User user) {
        // Tu peux gérer le chiffrement du mot de passe ici, etc.
        return userRepository.save(user);
    }
}


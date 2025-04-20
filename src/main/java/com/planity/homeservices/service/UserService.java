package com.planity.homeservices.service;

import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Authentifie un utilisateur via email et mot de passe
     */
    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    /**
     * Enregistre un nouvel utilisateur si l'email n'est pas déjà pris
     */
    public boolean register(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return false; // email déjà utilisé
        }
        userRepository.save(user);
        return true;
    }
}

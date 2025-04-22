package com.planity.homeservices.service;

import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && encoder.matches(password, user.getPassword())) {
            return user;
        }
        return null;
    }

    public boolean register(User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return false;
        }
        user.setPassword(encoder.encode(user.getPassword()));
        userRepository.save(user);
        return true;
    }
}
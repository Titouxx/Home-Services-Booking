package com.planity.homeservices.service;

import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(String username, String rawPassword, String status) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists");
        }

        String encodedPassword = passwordEncoder.encode(rawPassword);
        User user = new User(username, encodedPassword, status);
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(rawPassword, user.getPassword())) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<User> authenticate(String username, String rawPassword) {
        return loginUser(username, rawPassword);
    }
}

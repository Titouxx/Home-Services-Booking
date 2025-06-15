package com.planity.homeservices.service;

import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
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
        return userRepository.findByUsername(username)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()));
    }

    public Optional<User> authenticate(String username, String rawPassword) {
        return loginUser(username, rawPassword);
    }

    public User updateProfile(Long userId,
                              String firstName,
                              String lastName,
                              Integer age,
                              String email,
                              String rawPassword) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        u.setFirstName(firstName);
        u.setLastName(lastName);
        u.setAge(age);
        u.setEmail(email);
        if (rawPassword != null && !rawPassword.isBlank()) {
            u.setPassword(passwordEncoder.encode(rawPassword));
        }
        return userRepository.save(u);
    }
}
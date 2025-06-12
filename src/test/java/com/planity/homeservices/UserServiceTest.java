package com.planity.homeservices;

import com.planity.homeservices.model.User;
import com.planity.homeservices.repository.UserRepository;
import com.planity.homeservices.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {

    private UserRepository userRepository;
    private PasswordEncoder passwordEncoder;
    private UserService userService;

    @BeforeEach
    public void setUp() {
        userRepository = mock(UserRepository.class);
        passwordEncoder = mock(PasswordEncoder.class);
        userService = new UserService(userRepository, passwordEncoder);
    }

    @Test
    public void testRegisterUser() {
        User user = new User("testuser", "encodedPass", "client");

        when(passwordEncoder.encode("rawPass")).thenReturn("encodedPass");
        when(userRepository.save(Mockito.any(User.class))).thenReturn(user);

        User result = userService.registerUser("testuser", "rawPass", "client");

        assertEquals("testuser", result.getUsername());
        assertEquals("encodedPass", result.getPassword());
        assertEquals("client", result.getStatus());
    }

    @Test
    public void testAuthenticateSuccess() {
        User user = new User("testuser", "encodedPass", "client");
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("rawPass", "encodedPass")).thenReturn(true);

        Optional<User> result = userService.authenticate("testuser", "rawPass");

        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
    }

    @Test
    public void testAuthenticateFailure() {
        when(userRepository.findByUsername("wronguser")).thenReturn(Optional.empty());

        Optional<User> result = userService.authenticate("wronguser", "wrongpass");

        assertFalse(result.isPresent());
    }
}

// src/test/java/com/planity/homeservices/UserControllerTest.java
package com.planity.homeservices;

import com.planity.homeservices.controller.UserController;
import com.planity.homeservices.model.User;
import com.planity.homeservices.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpSession;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterUserSuccess() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("newuser");
        when(userService.registerUser("newuser", "raw", "client"))
                .thenReturn(mockUser);

        ResponseEntity<?> response = userController.registerUser(
                Map.of("username", "newuser", "password", "raw", "status", "client")
        );

        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("User registered: newuser"));
    }

    @Test
    void testRegisterUserFailure() {
        when(userService.registerUser("dup", "raw", "client"))
                .thenThrow(new IllegalArgumentException("Username already exists"));

        ResponseEntity<?> response = userController.registerUser(
                Map.of("username", "dup", "password", "raw", "status", "client")
        );

        assertEquals(400, response.getStatusCodeValue());
        assertEquals("Username already exists", response.getBody());
    }

    @Test
    void testLoginSuccess() {
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("testuser");
        mockUser.setPassword("pass");
        mockUser.setStatus("client");
        when(userService.authenticate("testuser", "pass"))
                .thenReturn(Optional.of(mockUser));

        HttpSession session = mock(HttpSession.class);
        ResponseEntity<?> response = userController.loginUser(
                Map.of("username", "testuser", "password", "pass"),
                session
        );

        assertEquals(200, response.getStatusCodeValue());
        verify(session).setAttribute("logged_in", true);
        verify(session).setAttribute("user", mockUser);

        @SuppressWarnings("unchecked")
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertEquals("Login successful", body.get("message"));
    }

    @Test
    void testLoginFailure() {
        when(userService.authenticate("invalid", "wrong"))
                .thenReturn(Optional.empty());

        HttpSession session = mock(HttpSession.class);
        ResponseEntity<?> response = userController.loginUser(
                Map.of("username", "invalid", "password", "wrong"),
                session
        );

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Invalid credentials", response.getBody());
        verify(session, never()).setAttribute(eq("logged_in"), any());
        verify(session, never()).setAttribute(eq("user"), any());
    }

    @Test
    void testLogout() {
        HttpSession session = mock(HttpSession.class);
        ResponseEntity<?> response = userController.logoutUser(session);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Logged out successfully", response.getBody());
        verify(session).invalidate();
    }

    @Test
    void testMeEndpointWhenLoggedIn() {
        HttpSession session = mock(HttpSession.class);
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setUsername("titou");
        mockUser.setStatus("client");

        when(session.getAttribute("logged_in")).thenReturn(true);
        when(session.getAttribute("user")).thenReturn(mockUser);

        ResponseEntity<?> response = userController.me(session);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockUser, response.getBody());
    }

    @Test
    void testMeEndpointWhenNotLoggedIn() {
        HttpSession session = mock(HttpSession.class);
        when(session.getAttribute("logged_in")).thenReturn(false);

        ResponseEntity<?> response = userController.me(session);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not logged in", response.getBody());
    }

    @Test
    void testUpdateMeSuccess() {
        User sessionUser = new User();
        sessionUser.setId(1L);

        User updatedUser = new User();
        updatedUser.setId(1L);
        updatedUser.setFirstName("John");
        updatedUser.setLastName("Doe");
        updatedUser.setEmail("john@example.com");
        updatedUser.setAge(30);

        when(userService.updateProfile(
                eq(1L),
                eq("John"), eq("Doe"), eq(30),
                eq("john@example.com"), eq("newpass")
        )).thenReturn(updatedUser);

        HttpSession session = mock(HttpSession.class);
        when(session.getAttribute("user")).thenReturn(sessionUser);

        Map<String, Object> body = Map.of(
                "firstName", "John",
                "lastName", "Doe",
                "age", 30,
                "email", "john@example.com",
                "password", "newpass"
        );

        ResponseEntity<?> response = userController.updateMe(body, session);

        assertEquals(200, response.getStatusCodeValue());
        User respUser = (User) response.getBody();
        assertEquals("John", respUser.getFirstName());
        assertEquals("Doe", respUser.getLastName());
        assertEquals(30, respUser.getAge());
        assertEquals("john@example.com", respUser.getEmail());

        verify(session).setAttribute("user", updatedUser);
    }

    @Test
    void testUpdateMeWhenNotLoggedIn() {
        HttpSession session = mock(HttpSession.class);
        when(session.getAttribute("user")).thenReturn(null);

        ResponseEntity<?> response = userController.updateMe(Map.of(), session);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not logged in", response.getBody());
    }
}
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
    public void testLoginSuccess() {
        User mockUser = new User(1L, "testuser", "pass", "client");
        when(userService.authenticate("testuser", "pass")).thenReturn(Optional.of(mockUser));

        HttpSession session = mock(HttpSession.class);
        ResponseEntity<?> response = userController.loginUser(Map.of("username", "testuser", "password", "pass"), session);

        assertEquals(200, response.getStatusCodeValue());
        verify(session).setAttribute("logged_in", true);
        verify(session).setAttribute("user", mockUser);
    }

    @Test
    public void testLoginFailure() {
        when(userService.authenticate("invalid", "wrong")).thenReturn(Optional.empty());

        HttpSession session = mock(HttpSession.class);
        ResponseEntity<?> response = userController.loginUser(Map.of("username", "invalid", "password", "wrong"), session);

        assertEquals(401, response.getStatusCodeValue());
    }

    @Test
    public void testLogout() {
        HttpSession session = mock(HttpSession.class);
        ResponseEntity<?> response = userController.logoutUser(session);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("Logged out successfully", response.getBody());
        verify(session).invalidate();
    }

    @Test
    public void testMeEndpoint_whenLoggedIn() {
        HttpSession session = mock(HttpSession.class);
        User mockUser = new User(1L, "titou", "hidden", "client");

        when(session.getAttribute("logged_in")).thenReturn(true);
        when(session.getAttribute("user")).thenReturn(mockUser);

        ResponseEntity<?> response = userController.me(session);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockUser, response.getBody());
    }

    @Test
    public void testMeEndpoint_whenNotLoggedIn() {
        HttpSession session = mock(HttpSession.class);
        when(session.getAttribute("logged_in")).thenReturn(false);

        ResponseEntity<?> response = userController.me(session);

        assertEquals(401, response.getStatusCodeValue());
        assertEquals("Not logged in", response.getBody());
    }
}

package com.planity.homeservices.controller;

import com.planity.homeservices.model.User;
import com.planity.homeservices.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    @Autowired
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/login")
    public String showLoginForm(Model model) {
        model.addAttribute("user", new User());
        return "login";
    }

    @PostMapping("/login")
    public String processLogin(
            @RequestParam String email,
            @RequestParam String password,
            Model model,
            HttpSession session
    ) {
        User user = userService.authenticate(email, password);
        if (user != null) {
            session.setAttribute("loggedUser", user);
            return "redirect:/"; // ou vers un dashboard selon le rôle
        } else {
            model.addAttribute("errorMessage", "Email ou mot de passe incorrect.");
            return "login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth/login";
    }
}
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

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String showLoginForm() {
        return "login"; // login.html dans templates
    }

    @PostMapping("/login")
    public String processLogin(
            @RequestParam String username,
            @RequestParam String password,
            Model model,
            HttpSession session
    ) {
        User user = userService.authenticate(username, password);
        if (user != null) {
            session.setAttribute("loggedUser", user);
            return "redirect:/"; // ou page d’accueil
        } else {
            model.addAttribute("errorMessage", "Nom d'utilisateur ou mot de passe invalide");
            return "login";
        }
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth/login";
    }
}

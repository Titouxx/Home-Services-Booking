package com.planity.homeservices.controller;

import com.planity.homeservices.model.User;
import com.planity.homeservices.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    // Affiche la page de connexion
    @GetMapping("/login")
    public String showLoginForm() {
        return "login"; // correspond à templates/login.html
    }

    // Traite le formulaire de connexion
    @PostMapping("/login")
    public String processLogin(
            @RequestParam String username,
            @RequestParam String password,
            Model model,
            HttpSession session
    ) {
        User user = userService.authenticate(username, password);
        if (user != null) {
            // Stocke l'utilisateur dans la session
            session.setAttribute("loggedUser", user);
            return "redirect:/home";  // page d'accueil ou page de destination
        } else {
            model.addAttribute("errorMessage", "Nom d'utilisateur ou mot de passe invalide");
            return "login";
        }
    }

    // Traitement de la déconnexion
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/auth/login";
    }
}

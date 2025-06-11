package com.planity.homeservices.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1) Désactivation de CSRF pour vos appels API (React, fetch, etc.)
                .csrf(csrf -> csrf.disable())

                // 2) Définition des accès publics et protégés
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/", "/index.html", "/vite.svg", "/assets/**",
                                "/login", "/register",
                                "/api/services", "/api/services/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // 3) Page de login fournie par votre front (React sur /login)
                .formLogin(form -> form
                        .loginPage("/login")
                        .permitAll()
                )

                // 4) Logout
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
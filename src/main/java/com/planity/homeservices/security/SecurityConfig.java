package com.planity.homeservices.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Désactive CSRF pour compatibilité fetch React
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/auth/**",
                                "/", "/index.html", "/vite.svg", "/assets/**",
                                "/login", "/register"
                        ).permitAll()
                        .requestMatchers("/api/services/**").authenticated()
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers.disable()) // ❗️ à restreindre en prod (désactive protections XSS, frame, etc.)
                .formLogin(form -> form.disable()) // Pas de form HTML
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .logoutSuccessUrl("/")
                )
                .sessionManagement(sess -> sess
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED) // permet de créer la session si elle n'existe pas
                        .maximumSessions(1)
                );

        return http.build();
    }
}

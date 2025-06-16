package com.planity.homeservices.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @SuppressWarnings("null")
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:8080")
            .allowedMethods("*")
            .allowedHeaders("*");
    }

    @Override
    public void addResourceHandlers(@SuppressWarnings("null")     ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/");
    }

    @Override
    public void addViewControllers(@SuppressWarnings("null")     ViewControllerRegistry registry) {
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
        
        registry.addViewController("/message/**")
                .setViewName("forward:/index.html");
        registry.addViewController("/messages/**")
                .setViewName("forward:/index.html");
        registry.addViewController("/login")
                .setViewName("forward:/index.html");
        registry.addViewController("/register")
                .setViewName("forward:/index.html");
        registry.addViewController("/provider-dashboard")
                .setViewName("forward:/index.html");
        registry.addViewController("/my-appointments")
                .setViewName("forward:/index.html");
        registry.addViewController("/provider/**")
                .setViewName("forward:/index.html");
    }
}

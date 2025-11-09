package com.localmart.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir}")
    private String uploadDir;

    /**
     * This method configures CORS for the whole application.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Applies to all routes under /api/
            .allowedOrigins("http://localhost:5173") // Your React app
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }

    /**
     * This method makes the /uploads folder publicly accessible.
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // When a request comes in for "/uploads/**"
        registry.addResourceHandler("/uploads/**")
                // Serve files from the 'uploads' folder on the disk
                .addResourceLocations("file:" + uploadDir + "/");
    }
}
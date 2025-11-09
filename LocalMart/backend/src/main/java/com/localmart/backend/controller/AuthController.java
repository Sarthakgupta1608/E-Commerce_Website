package com.localmart.backend.controller;

import com.localmart.backend.dto.auth.LoginRequest;
import com.localmart.backend.dto.auth.LoginResponse;
import com.localmart.backend.dto.auth.RegisterCustomerRequest;
import com.localmart.backend.dto.auth.RegisterSellerRequest;
import com.localmart.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/customer")
    public ResponseEntity<?> registerCustomer(@Valid @RequestBody RegisterCustomerRequest request) {
        try {
            authService.registerCustomer(request);
            return ResponseEntity.ok("Customer registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register/seller")
    public ResponseEntity<?> registerSeller(@Valid @RequestBody RegisterSellerRequest request) {
        try {
            authService.registerSeller(request);
            return ResponseEntity.ok("Seller registered successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- NEW LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            // This catches bad email/password
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }
}
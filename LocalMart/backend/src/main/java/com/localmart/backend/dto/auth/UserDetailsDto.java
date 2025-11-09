package com.localmart.backend.dto.auth;

// This holds the user's info to send to the frontend
public record UserDetailsDto(
    Long id,
    String name,
    String email,
    String storeName // Will be null for customers
) {}
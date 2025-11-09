package com.localmart.backend.dto.auth;

// Now includes the user's details
public record LoginResponse(
    String token,
    String role,
    UserDetailsDto user
) {}
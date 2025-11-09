package com.localmart.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// This is a simple Java "record" class. It's a modern way to create a DTO.
public record RegisterCustomerRequest(
    @NotBlank
    @Size(min = 2, max = 100)
    String name,

    @NotBlank
    @Email
    String email,

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String password
) {}
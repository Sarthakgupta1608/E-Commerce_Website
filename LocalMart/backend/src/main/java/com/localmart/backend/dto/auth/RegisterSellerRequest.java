package com.localmart.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterSellerRequest(
    @NotBlank
    @Size(min = 2, max = 100)
    String storeName,

    @NotBlank
    @Size(min = 2, max = 100)
    String ownerName, // This maps to the "name" field in the form

    @NotBlank
    @Email
    String email,

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters long")
    String password
) {}
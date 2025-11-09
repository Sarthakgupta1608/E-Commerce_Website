package com.localmart.backend.dto.customer;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

// Fields the user is allowed to update
public record UpdateDetailsRequest(
    @Size(min = 2, max = 100)
    String name,

    @Email
    String email, // We can let them update this, but we'd need to re-verify

    String shippingAddress
) {}
package com.localmart.backend.dto.cart;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
    @NotBlank
    String shippingAddress
) {}
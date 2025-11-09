package com.localmart.backend.dto.customer;

public record CustomerDetailsDto(
    String name,
    String email,
    String shippingAddress
) {}
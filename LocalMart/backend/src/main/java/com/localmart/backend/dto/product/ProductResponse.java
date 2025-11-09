package com.localmart.backend.dto.product;

public record ProductResponse(
    Long productId,
    String name,
    String description,
    Double price,
    Integer stockQuantity,
    String imageUrl,
    Long sellerId,
    String storeName,
    String category // <-- ADDED
) {}
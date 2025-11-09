package com.localmart.backend.dto.cart;

public record CartItemResponse(
    Long cartItemId,
    Long productId,
    String name,
    Double price,
    String imageUrl,
    Integer quantity,
    String storeName
) {}
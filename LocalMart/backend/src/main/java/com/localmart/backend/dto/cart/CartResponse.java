package com.localmart.backend.dto.cart;

import java.util.List;

public record CartResponse(
    List<CartItemResponse> items,
    Double subtotal
) {}
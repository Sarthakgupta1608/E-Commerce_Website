package com.localmart.backend.dto.order;

import java.time.LocalDateTime;
import java.util.List;

// THIS IS THE FIX:
// We removed "public" so it's no longer a public top-level type.
public record OrderItemResponse(
    String productName,
    Integer quantity,
    Double priceAtPurchase,
    String imageUrl
) {}

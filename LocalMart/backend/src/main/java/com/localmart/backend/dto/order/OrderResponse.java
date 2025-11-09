package com.localmart.backend.dto.order;

import java.time.LocalDateTime;
import java.util.List;

// THIS IS THE FIX:
// We removed "public" so it's no longer a public top-level type.


// This is the main DTO, and its name matches the file.
public record OrderResponse(
    Long orderId,
    LocalDateTime orderDate,
    Double totalAmount,
    String status,
    String shippingAddress,
    List<OrderItemResponse> items
) {}
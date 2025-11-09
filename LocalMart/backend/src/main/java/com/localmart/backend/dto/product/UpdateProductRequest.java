package com.localmart.backend.dto.product;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record UpdateProductRequest(
    @Size(max = 255)
    String name,

    String description,

    @PositiveOrZero
    Double price,

    @PositiveOrZero
    Integer stockQuantity,

    String category // Can also update category
) {}
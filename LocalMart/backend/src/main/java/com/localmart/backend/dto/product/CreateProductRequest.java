package com.localmart.backend.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public record CreateProductRequest(
    @NotBlank
    @Size(max = 255)
    String name,

    String description,

    @NotNull
    @PositiveOrZero
    Double price,

    @NotNull
    @PositiveOrZero
    Integer stockQuantity,

    @NotBlank // Category is now required
    String category
) {}
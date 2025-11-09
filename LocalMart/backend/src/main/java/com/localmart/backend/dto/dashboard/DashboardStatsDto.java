package com.localmart.backend.dto.dashboard;

// This DTO will hold the stats for the seller dashboard
public record DashboardStatsDto(
    Double totalRevenue,
    Long totalOrders,
    Long totalProducts
) {}
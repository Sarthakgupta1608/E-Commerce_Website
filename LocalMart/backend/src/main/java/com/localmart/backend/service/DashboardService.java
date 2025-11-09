package com.localmart.backend.service;

import com.localmart.backend.dto.dashboard.DashboardStatsDto;
import com.localmart.backend.model.Seller;
import com.localmart.backend.repository.OrderItemRepository;
import com.localmart.backend.repository.ProductRepository;
import com.localmart.backend.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SellerRepository sellerRepository;

    public DashboardStatsDto getSellerStats() {
        // 1. Get the currently logged-in seller
        Seller seller = getAuthenticatedSeller();
        Long sellerId = seller.getSellerId();

        // 2. Call our new repository methods
        Double totalRevenue = orderItemRepository.findTotalRevenueBySellerId(sellerId);
        Long totalOrders = orderItemRepository.countOrdersBySellerId(sellerId);
        Long totalProducts = productRepository.countBySeller_sellerId(sellerId);

        // 3. Return the combined DTO
        return new DashboardStatsDto(totalRevenue, totalOrders, totalProducts);
    }

    private Seller getAuthenticatedSeller() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerEmail = authentication.getName();

        return sellerRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
    }
}
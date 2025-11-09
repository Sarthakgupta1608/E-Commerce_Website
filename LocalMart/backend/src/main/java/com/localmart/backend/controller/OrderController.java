package com.localmart.backend.controller;

import com.localmart.backend.dto.order.OrderResponse;
import com.localmart.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    /**
     * Gets the order history for the logged-in customer.
     */
    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getCustomerOrders() {
        List<OrderResponse> orders = orderService.getOrdersForCustomer();
        return ResponseEntity.ok(orders);
    }

    /**
     * Gets all received orders for the logged-in seller.
     */
    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<OrderResponse>> getSellerOrders() {
        List<OrderResponse> orders = orderService.getOrdersForSeller();
        return ResponseEntity.ok(orders);
    }
}
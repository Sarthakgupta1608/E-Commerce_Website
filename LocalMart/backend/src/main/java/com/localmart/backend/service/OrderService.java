package com.localmart.backend.service;

import com.localmart.backend.dto.order.OrderResponse;
import com.localmart.backend.dto.order.OrderItemResponse; // 1. IMPORT OrderItemResponse
import com.localmart.backend.model.Customer;
import com.localmart.backend.model.Order;
import com.localmart.backend.model.Seller;
import com.localmart.backend.repository.CustomerRepository;
import com.localmart.backend.repository.OrderRepository;
import com.localmart.backend.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import com.localmart.backend.dto.order.OrderItemResponse;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private SellerRepository sellerRepository;

    /**
     * Gets the order history for the currently logged-in customer.
     */
    public List<OrderResponse> getOrdersForCustomer() {
        Customer customer = getAuthenticatedCustomer();
        List<Order> orders = orderRepository.findByCustomer_CustomerIdOrderByOrderDateDesc(customer.getCustomerId());
        return orders.stream()
                .map(this::mapToOrderResponse) // Convert each Order to an OrderResponse DTO
                .collect(Collectors.toList());
    }

    /**
     * Gets all received orders for the currently logged-in seller.
     */
    public List<OrderResponse> getOrdersForSeller() {
        Seller seller = getAuthenticatedSeller();
        List<Order> orders = orderRepository.findOrdersBySellerId(seller.getSellerId());
        return orders.stream()
                .map(this::mapToOrderResponse) // Reuse the same DTO
                .collect(Collectors.toList());
    }

    // --- HELPER METHODS ---

    private Customer getAuthenticatedCustomer() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));
    }

    private Seller getAuthenticatedSeller() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return sellerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
    }

    /**
     * Converts an Order Entity into an OrderResponse DTO.
     */
    private OrderResponse mapToOrderResponse(Order order) {
        
        // --- THIS IS THE FIX (Lines 73-77) ---
        // We use "OrderItemResponse" directly, not "OrderResponse.OrderItemResponse"
        List<OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPriceAtPurchase(),
                        item.getProduct().getImageUrl()
                ))
                .collect(Collectors.toList());
        // ------------------------------------

        // Create the main OrderResponse DTO
        return new OrderResponse(
                order.getOrderId(),
                order.getOrderDate(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getShippingAddress(),
                itemResponses
        );
    }
}
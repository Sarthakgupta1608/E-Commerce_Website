package com.localmart.backend.repository;

import com.localmart.backend.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // 1. ADD IMPORT
import org.springframework.data.repository.query.Param; // 2. ADD IMPORT
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // Finds all orders placed by a specific customer
    List<Order> findByCustomer_CustomerIdOrderByOrderDateDesc(Long customerId);

    // --- 3. ADD THIS NEW METHOD ---
    /**
     * Finds all orders that contain at least one product from a specific seller.
     * It uses DISTINCT to ensure each order appears only once.
     */
    @Query("SELECT DISTINCT oi.order FROM OrderItem oi " +
           "WHERE oi.product.seller.sellerId = :sellerId " +
           "ORDER BY oi.order.orderDate DESC")
    List<Order> findOrdersBySellerId(@Param("sellerId") Long sellerId);
}
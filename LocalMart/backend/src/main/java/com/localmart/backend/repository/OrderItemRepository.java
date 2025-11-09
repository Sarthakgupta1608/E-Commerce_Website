package com.localmart.backend.repository;

import com.localmart.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // 1. ADD IMPORT
import org.springframework.data.repository.query.Param; // 2. ADD IMPORT
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // --- 3. ADD THESE NEW METHODS ---

    /**
     * Calculates the total revenue for a specific seller by summing
     * the price * quantity of all order items linked to their products.
     */
    @Query("SELECT COALESCE(SUM(oi.priceAtPurchase * oi.quantity), 0.0) " +
           "FROM OrderItem oi " +
           "WHERE oi.product.seller.sellerId = :sellerId")
    Double findTotalRevenueBySellerId(@Param("sellerId") Long sellerId);

    /**
     * Counts the distinct number of orders that contain
     * at least one product from a specific seller.
     */
    @Query("SELECT COUNT(DISTINCT oi.order.orderId) " +
           "FROM OrderItem oi " +
           "WHERE oi.product.seller.sellerId = :sellerId")
    Long countOrdersBySellerId(@Param("sellerId") Long sellerId);
}
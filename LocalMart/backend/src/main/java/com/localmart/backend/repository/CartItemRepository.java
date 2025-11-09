package com.localmart.backend.repository;

import com.localmart.backend.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.transaction.Transactional; // 1. IMPORT THIS
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCustomer_CustomerId(Long customerId);

    Optional<CartItem> findByCustomer_CustomerIdAndProduct_ProductId(Long customerId, Long productId);

    @Transactional // 2. ADD THIS
    void deleteByCustomer_CustomerId(Long customerId);

    // --- 3. ADD THIS NEW METHOD ---
    @Transactional
    void deleteByCartItemIdAndCustomer_CustomerId(Long cartItemId, Long customerId);
}
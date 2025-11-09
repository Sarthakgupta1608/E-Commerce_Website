package com.localmart.backend.repository;

import com.localmart.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// ... (imports)
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findBySeller_sellerId(Long sellerId);
    
    List<Product> findByNameContainingIgnoreCase(String query);
    
    Long countBySeller_sellerId(Long sellerId);

    // --- ADD THIS NEW METHOD ---
    /**
     * Finds the top 4 products in the same category,
     * excluding the product itself.
     */
    List<Product> findTop4ByCategoryAndProductIdNot(String category, Long productId);
}
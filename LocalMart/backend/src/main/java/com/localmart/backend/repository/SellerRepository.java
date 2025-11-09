package com.localmart.backend.repository;

import com.localmart.backend.model.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {

    // Find a seller by their email
    Optional<Seller> findByEmail(String email);

    // Check if a seller email already exists
    Boolean existsByEmail(String email);

    // This will be useful later for the seller dashboard
    Optional<Seller> findByStoreName(String storeName);

    // Check if a store name is already taken
    Boolean existsByStoreName(String storeName);
}
package com.localmart.backend.repository;

import com.localmart.backend.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // This method will let us find a customer by their email
    // Spring Data JPA automatically understands this method name
    Optional<Customer> findByEmail(String email);
    
    // This will let us check if an email already exists
    Boolean existsByEmail(String email);
}
package com.localmart.backend.service;

import com.localmart.backend.dto.customer.CustomerDetailsDto;
import com.localmart.backend.dto.customer.UpdateDetailsRequest;
import com.localmart.backend.model.Customer;
import com.localmart.backend.repository.CustomerRepository;
import com.localmart.backend.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SellerRepository sellerRepository; // To check for email conflicts

    /**
     * Gets the details for the currently logged-in customer.
     */
    public CustomerDetailsDto getCustomerDetails() {
        Customer customer = getAuthenticatedCustomer();
        return new CustomerDetailsDto(
            customer.getName(),
            customer.getEmail(),
            customer.getShippingAddress()
        );
    }

    /**
     * Updates the details for the currently logged-in customer.
     */
    public CustomerDetailsDto updateCustomerDetails(UpdateDetailsRequest request) {
        Customer customer = getAuthenticatedCustomer();

        // Update name if provided
        if (request.name() != null && !request.name().isEmpty()) {
            customer.setName(request.name());
        }

        // Update email if provided AND it's not already taken
        if (request.email() != null && !request.email().isEmpty() && !request.email().equals(customer.getEmail())) {
            if (customerRepository.existsByEmail(request.email()) || sellerRepository.existsByEmail(request.email())) {
                throw new IllegalArgumentException("Email is already in use.");
            }
            customer.setEmail(request.email());
        }

        // Update shipping address
        customer.setShippingAddress(request.shippingAddress());

        Customer updatedCustomer = customerRepository.save(customer);

        return new CustomerDetailsDto(
            updatedCustomer.getName(),
            updatedCustomer.getEmail(),
            updatedCustomer.getShippingAddress()
        );
    }

    // Helper method to get the logged-in Customer object
    private Customer getAuthenticatedCustomer() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return customerRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));
    }
}
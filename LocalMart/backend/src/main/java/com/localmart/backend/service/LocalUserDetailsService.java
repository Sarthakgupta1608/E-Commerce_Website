package com.localmart.backend.service;

import com.localmart.backend.model.Customer;
import com.localmart.backend.model.Seller;
import com.localmart.backend.repository.CustomerRepository;
import com.localmart.backend.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Service
public class LocalUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Try to find a customer
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            // Return a Spring Security User object
            return new User(
                customer.getEmail(), 
                customer.getPassword(), 
                getAuthorities("ROLE_CUSTOMER")
            );
        }

        // 2. If not a customer, try to find a seller
        Optional<Seller> sellerOpt = sellerRepository.findByEmail(email);
        if (sellerOpt.isPresent()) {
            Seller seller = sellerOpt.get();
            // Return a Spring Security User object
            return new User(
                seller.getEmail(), 
                seller.getPassword(), 
                getAuthorities("ROLE_SELLER")
            );
        }

        // 3. If no user is found
        throw new UsernameNotFoundException("User not found with email: " + email);
    }

    private Collection<? extends GrantedAuthority> getAuthorities(String role) {
        return List.of(new SimpleGrantedAuthority(role));
    }
}
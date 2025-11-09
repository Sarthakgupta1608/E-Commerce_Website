package com.localmart.backend.service;

import com.localmart.backend.dto.cart.AddToCartRequest;
import com.localmart.backend.dto.cart.CartItemResponse;
import com.localmart.backend.dto.cart.CartResponse;
import com.localmart.backend.dto.cart.CheckoutRequest;
import com.localmart.backend.model.*;
import com.localmart.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private OrderRepository orderRepository;

    /**
     * Adds an item to the current customer's cart.
     */
    public void addToCart(AddToCartRequest request) {
        Customer customer = getAuthenticatedCustomer();
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if the item is already in the cart
        Optional<CartItem> existingItemOpt = cartItemRepository.findByCustomer_CustomerIdAndProduct_ProductId(
                customer.getCustomerId(), product.getProductId()
        );

        if (existingItemOpt.isPresent()) {
            // If item exists, just update the quantity
            CartItem existingItem = existingItemOpt.get();
            existingItem.setQuantity(existingItem.getQuantity() + request.quantity());
            cartItemRepository.save(existingItem);
        } else {
            // If item is new, create a new CartItem
            CartItem cartItem = new CartItem();
            cartItem.setCustomer(customer);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.quantity());
            cartItemRepository.save(cartItem);
        }
    }

    /**
     * Gets all items in the current customer's cart.
     */
    public CartResponse getCart() {
        Customer customer = getAuthenticatedCustomer();
        List<CartItem> cartItems = cartItemRepository.findByCustomer_CustomerId(customer.getCustomerId());

        List<CartItemResponse> itemResponses = cartItems.stream()
                .map(this::mapToCartItemResponse)
                .collect(Collectors.toList());

        Double subtotal = itemResponses.stream()
                .mapToDouble(item -> item.price() * item.quantity())
                .sum();

        return new CartResponse(itemResponses, subtotal);
    }

    /**
     * Performs the checkout process.
     * This is a @Transactional method, meaning if any part fails,
     * the entire operation is rolled back (e.g., the cart isn't cleared).
     */
    @Transactional
    public void checkout(CheckoutRequest request) {
        Customer customer = getAuthenticatedCustomer();
        List<CartItem> cartItems = cartItemRepository.findByCustomer_CustomerId(customer.getCustomerId());

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cannot checkout with an empty cart.");
        }

        // 1. Create the Order
        Order order = new Order();
        order.setCustomer(customer);
        order.setShippingAddress(request.shippingAddress());
        order.setStatus("Pending");

        // 2. Add OrderItems to the Order
        double totalAmount = 0.0;
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            
            // Check stock
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new RuntimeException("Not enough stock for " + product.getName());
            }
            
            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            // Create OrderItem
            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPriceAtPurchase(product.getPrice());
            
            // Add item to the order
            order.addOrderItem(orderItem);
            
            totalAmount += product.getPrice() * cartItem.getQuantity();
        }

        // 3. Set total amount and save the order
        order.setTotalAmount(totalAmount);
        orderRepository.save(order); // This also saves all OrderItems due to CascadeType.ALL

        // 4. Clear the customer's cart
        cartItemRepository.deleteByCustomer_CustomerId(customer.getCustomerId());
    }
    public void removeItemFromCart(Long cartItemId) {
        Customer customer = getAuthenticatedCustomer();
        
        // This ensures a customer can only delete their own cart items
        cartItemRepository.deleteByCartItemIdAndCustomer_CustomerId(cartItemId, customer.getCustomerId());
    }

    /**
     * Helper to get the logged-in Customer entity
     */
    private Customer getAuthenticatedCustomer() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String customerEmail = authentication.getName();

        return customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));
    }

    /**
     * Helper to map a CartItem entity to its DTO response
     */
    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return new CartItemResponse(
                cartItem.getCartItemId(),
                product.getProductId(),
                product.getName(),
                product.getPrice(),
                product.getImageUrl(),
                cartItem.getQuantity(),
                product.getSeller().getStoreName()
        );
    }
}
package com.localmart.backend.controller;

import com.localmart.backend.dto.cart.AddToCartRequest;
import com.localmart.backend.dto.cart.CartResponse;
import com.localmart.backend.dto.cart.CheckoutRequest;
import com.localmart.backend.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('CUSTOMER')") // Only customers can access this controller
public class CartController {

    @Autowired
    private CartService cartService;

    /**
     * Gets the current customer's cart.
     */
    @GetMapping
    public ResponseEntity<CartResponse> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    /**
     * Adds an item to the cart.
     */
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@Valid @RequestBody AddToCartRequest request) {
        try {
            cartService.addToCart(request);
            return ResponseEntity.ok().body("Item added to cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/item/{id}")
    public ResponseEntity<?> removeItem(@PathVariable("id") Long cartItemId) {
        try {
            cartService.removeItemFromCart(cartItemId);
            return ResponseEntity.ok().body("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // We will add endpoints for updating/deleting cart items later
    // e.g., @DeleteMapping("/item/{id}")

    /**
     * Checks out the cart and creates an order.
     */
    @PostMapping("/checkout")
    public ResponseEntity<?> checkout(@Valid @RequestBody CheckoutRequest request) {
        try {
            cartService.checkout(request);
            return ResponseEntity.ok().body("Checkout successful, order created!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
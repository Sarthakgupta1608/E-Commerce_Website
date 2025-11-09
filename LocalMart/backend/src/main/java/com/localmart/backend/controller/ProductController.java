package com.localmart.backend.controller;

import com.localmart.backend.dto.product.CreateProductRequest;
import com.localmart.backend.dto.product.ProductResponse;
import com.localmart.backend.dto.product.UpdateProductRequest;
import com.localmart.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    // --- PUBLIC ENDPOINTS ---

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable("id") Long productId) {
        try {
            ProductResponse product = productService.getProductById(productId);
            return ResponseEntity.ok(product);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(@RequestParam("q") String query) {
        List<ProductResponse> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }

    // --- NEW PUBLIC ENDPOINT ---
    @GetMapping("/{id}/related")
    public ResponseEntity<List<ProductResponse>> getRelatedProducts(@PathVariable("id") Long productId) {
        List<ProductResponse> products = productService.getRelatedProducts(productId);
        return ResponseEntity.ok(products);
    }

    // --- SELLER-ONLY ENDPOINTS ---

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductResponse newProduct = productService.createProduct(request);
        return ResponseEntity.ok(newProduct);
    }

    @PostMapping("/{id}/image")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> uploadImage(
            @PathVariable("id") Long productId,
            @RequestParam("file") MultipartFile file
    ) {
        ProductResponse updatedProduct = productService.uploadProductImage(productId, file);
        return ResponseEntity.ok(updatedProduct);
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<ProductResponse>> getSellerProducts() {
        List<ProductResponse> products = productService.getProductsForCurrentSeller();
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable("id") Long productId,
            @Valid @RequestBody UpdateProductRequest request
    ) {
        ProductResponse updatedProduct = productService.updateProduct(productId, request);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> deleteProduct(@PathVariable("id") Long productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.ok().body("Product deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
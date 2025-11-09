package com.localmart.backend.service;

import com.localmart.backend.dto.product.CreateProductRequest;
import com.localmart.backend.dto.product.ProductResponse;
import com.localmart.backend.dto.product.UpdateProductRequest;
import com.localmart.backend.model.Product;
import com.localmart.backend.model.Seller;
import com.localmart.backend.repository.ProductRepository;
import com.localmart.backend.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SellerRepository sellerRepository;
    @Autowired
    private FileStorageService fileStorageService;

    // --- SELLER-SPECIFIC METHODS ---

    public ProductResponse createProduct(CreateProductRequest request) {
        Seller seller = getAuthenticatedSeller();
        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStockQuantity(request.stockQuantity());
        product.setCategory(request.category()); // <-- ADDED
        product.setSeller(seller);
        Product savedProduct = productRepository.save(product);
        return mapToProductResponse(savedProduct);
    }

    public ProductResponse updateProduct(Long productId, UpdateProductRequest request) {
        Seller seller = getAuthenticatedSeller();
        Product product = getProductAndVerifySeller(productId, seller.getSellerId());
        if (request.name() != null) product.setName(request.name());
        if (request.description() != null) product.setDescription(request.description());
        if (request.price() != null) product.setPrice(request.price());
        if (request.stockQuantity() != null) product.setStockQuantity(request.stockQuantity());
        if (request.category() != null) product.setCategory(request.category()); // <-- ADDED
        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }
    
    // ... (deleteProduct, uploadProductImage, getProductsForCurrentSeller are unchanged) ...
    public void deleteProduct(Long productId) {
        Seller seller = getAuthenticatedSeller();
        Product product = getProductAndVerifySeller(productId, seller.getSellerId());
        productRepository.delete(product);
    }

    public ProductResponse uploadProductImage(Long productId, MultipartFile file) {
        Seller seller = getAuthenticatedSeller();
        Product product = getProductAndVerifySeller(productId, seller.getSellerId());
        String filename = fileStorageService.store(file);
        String imageUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(filename)
                .toUriString();
        product.setImageUrl(imageUrl);
        Product updatedProduct = productRepository.save(product);
        return mapToProductResponse(updatedProduct);
    }

    public List<ProductResponse> getProductsForCurrentSeller() {
        Seller seller = getAuthenticatedSeller();
        return productRepository.findBySeller_sellerId(seller.getSellerId())
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // --- PUBLIC METHODS ---

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToProductResponse(product);
    }

    public List<ProductResponse> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCase(query)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // --- NEW METHOD for Related Products ---
    public List<ProductResponse> getRelatedProducts(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        return productRepository.findTop4ByCategoryAndProductIdNot(product.getCategory(), productId)
                .stream()
                .map(this::mapToProductResponse)
                .collect(Collectors.toList());
    }

    // --- HELPER METHODS ---

    private Seller getAuthenticatedSeller() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String sellerEmail = authentication.getName();
        return sellerRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
    }

    private Product getProductAndVerifySeller(Long productId, Long sellerId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (!product.getSeller().getSellerId().equals(sellerId)) {
            throw new SecurityException("You do not have permission to modify this product");
        }
        return product;
    }

    // UPDATED mapToProductResponse
    private ProductResponse mapToProductResponse(Product product) {
        return new ProductResponse(
                product.getProductId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStockQuantity(),
                product.getImageUrl(),
                product.getSeller().getSellerId(),
                product.getSeller().getStoreName(),
                product.getCategory() // <-- ADDED
        );
    }
}
package es.jose.backend.controllers;

import es.jose.backend.services.ProductService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.ProductsApi;
import org.openapitools.model.AddProductRequest;
import org.openapitools.model.Product;
import org.openapitools.model.UpdateProductRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class ProductController implements ProductsApi {

    private final ProductService productService;

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Product> createProduct(@Valid AddProductRequest addProductRequest) {
        var product = productService.createProduct(addProductRequest);
        var location =
                ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(product.id())
                        .toUri();
        return ResponseEntity.created(location).body(product);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProduct(Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Product>> getAllProducts(Optional<Long> productCategoryId) {
        return ResponseEntity.ok(productService.getAllProducts(productCategoryId));
    }

    @Override
    public ResponseEntity<Product> getProductById(Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> removeProductImage(Long id) {
        productService.removeCourseImage(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Product> updateProduct(
            Long id, @Valid UpdateProductRequest updateProductRequest) {
        var product = productService.updateProduct(id, updateProductRequest);
        var location =
                ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(product.id())
                        .toUri();
        return ResponseEntity.created(location).body(product);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Product> updateProductImage(Long id, MultipartFile img) {
        var product = productService.updateCourseImage(id, img);
        var location =
                ServletUriComponentsBuilder.fromCurrentRequest()
                        .path("/{id}")
                        .buildAndExpand(product.id())
                        .toUri();
        return ResponseEntity.created(location).body(product);
    }
}

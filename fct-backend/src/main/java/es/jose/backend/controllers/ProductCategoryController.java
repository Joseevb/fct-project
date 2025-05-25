package es.jose.backend.controllers;

import es.jose.backend.services.ProductCategoryService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.ProductCategoriesApi;
import org.openapitools.model.AddProductCategoryRequest;
import org.openapitools.model.ProductCategory;
import org.openapitools.model.UpdateProductCategoryRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class ProductCategoryController implements ProductCategoriesApi {

    private final ProductCategoryService productCategoryService;

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductCategory> createProductCategory(
            @Valid AddProductCategoryRequest addProductCategoryRequest) {
        var productCategory =
                productCategoryService.createProductCategory(addProductCategoryRequest);
        return ResponseEntity.created(
                        URI.create("/api/v1/product-categories/" + productCategory.id()))
                .body(productCategory);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteProductCategory(Long id) {
        productCategoryService.deleteProductCategory(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<ProductCategory>> getAllProductCategories() {
        return ResponseEntity.ok(productCategoryService.getAllProductCategories());
    }

    @Override
    public ResponseEntity<ProductCategory> getProductCategoryById(Long id) {
        return ResponseEntity.ok(productCategoryService.getProductCategoryById(id));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ProductCategory> updateProductCategory(
            Long id, @Valid UpdateProductCategoryRequest updateProductCategoryRequest) {
        var productCategory =
                productCategoryService.updateProductCategory(id, updateProductCategoryRequest);
        return ResponseEntity.created(
                        URI.create("/api/v1/product-categories/" + productCategory.id()))
                .body(productCategory);
    }
}

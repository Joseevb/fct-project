package es.jose.backend.services;

import es.jose.backend.mappers.ProductCategoryMapper;
import es.jose.backend.persistence.entities.ProductCategoryEntity;
import es.jose.backend.persistence.repositories.ProductCategoryRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddProductCategoryRequest;
import org.openapitools.model.ProductCategory;
import org.openapitools.model.UpdateProductCategoryRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing product categories. Provides methods for retrieving,
 * creating, updating, and deleting product categories and interacts with the
 * ProductCategoryRepository.
 */
@Service
@RequiredArgsConstructor
public class ProductCategoryServiceImpl implements ProductCategoryService {

    private final ProductCategoryMapper productCategoryMapper;
    private final ProductCategoryRepository productCategoryRepository;

    /**
     * Gets all product categories from the database.
     *
     * @return A list of product categories.
     */
    @Override
    public List<ProductCategory> getAllProductCategories() {
        return productCategoryRepository.findAll().stream()
                .map(productCategoryMapper::toDto)
                .toList();
    }

    /**
     * Gets a product category by its ID.
     *
     * @param id The product category's ID.
     * @return The product category with the given ID.
     * @throws EntityNotFoundException if no product category is found with the given ID.
     */
    @Override
    public ProductCategory getProductCategoryById(Long id) {
        return productCategoryRepository
                .findById(id)
                .map(productCategoryMapper::toDto)
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "Unimplemented method 'getProductCategoryById'"));
    }

    /**
     * Gets a product category entity by its ID.
     *
     * @param id The product category's ID.
     * @return The product category entity with the given ID.
     * @throws EntityNotFoundException if no product category entity is found with the given ID.
     */
    @Override
    public ProductCategoryEntity getProductCategoryEntityById(Long id) {
        return productCategoryRepository
                .findById(id)
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "Could not find product category with id " + id));
    }

    /**
     * Creates a new product category. Checks for uniqueness by name before saving.
     *
     * @param productCategory The product category to create.
     * @return The created product category.
     * @throws EntityExistsException if a product category with the same name already exists.
     */
    @Override
    public ProductCategory createProductCategory(AddProductCategoryRequest productCategory) {
        return Optional.ofNullable(productCategory)
                .filter(p -> !productCategoryRepository.existsByName(productCategory.name()))
                .map(productCategoryMapper::toEntity)
                .map(productCategoryRepository::save)
                .map(productCategoryMapper::toDto)
                .orElseThrow(
                        () -> new EntityExistsException("Category with that name already exitst"));
    }

    /**
     * Updates a product category. Finds the existing entity, updates its properties based on the
     * request DTO, saves it, and returns the updated DTO.
     *
     * @param id The product category's ID.
     * @param productCategory The updated product category.
     * @return The updated product category.
     * @throws EntityNotFoundException if no product category is found with the given ID.
     */
    @Override
    public ProductCategory updateProductCategory(
            Long id, UpdateProductCategoryRequest productCategory) {
        return productCategoryRepository
                .findById(id)
                .map(
                        entity -> {
                            productCategoryMapper.updateEntity(productCategory, entity);
                            return entity;
                        })
                .map(productCategoryRepository::save)
                .map(productCategoryMapper::toDto)
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "Could not find product category with id " + id));
    }

    /**
     * Deletes a product category.
     *
     * @param id The product category's ID.
     * @throws EntityNotFoundException if no product category is found with the given ID.
     */
    @Override
    public void deleteProductCategory(Long id) {
        productCategoryRepository
                .findById(id)
                .ifPresentOrElse(
                        (productCategoryRepository::delete),
                        () -> {
                            throw new EntityNotFoundException(
                                    "Product category with id " + id + " not found");
                        });
    }

    /**
     * Checks if a product category name is unique.
     *
     * @param request The AddProductCategoryRequest containing the name to check.
     * @return true if the name is unique, false otherwise.
     */
    private boolean isProductCategoryUnique(AddProductCategoryRequest request) {
        return !productCategoryRepository.existsByName(request.name());
    }
}

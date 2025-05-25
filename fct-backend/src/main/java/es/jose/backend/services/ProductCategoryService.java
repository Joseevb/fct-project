package es.jose.backend.services;

import es.jose.backend.persistence.entities.ProductCategoryEntity;

import org.openapitools.model.AddProductCategoryRequest;
import org.openapitools.model.ProductCategory;
import org.openapitools.model.UpdateProductCategoryRequest;

import java.util.List;

public interface ProductCategoryService {

    /**
     * Gets all product categories from the database.
     *
     * @return A list of product categories.
     */
    List<ProductCategory> getAllProductCategories();

    /**
     * Gets a product category by its ID.
     *
     * @param id The product category's ID.
     * @return The product category with the given ID.
     */
    ProductCategory getProductCategoryById(Long id);

    /**
     * Gets a product category entity by its ID.
     *
     * @param id The product category's ID.
     * @return The product category entity with the given ID.
     */
    ProductCategoryEntity getProductCategoryEntityById(Long id);

    /**
     * Creates a new product category.
     *
     * @param productCategory The product category to create.
     * @return The created product category.
     */
    ProductCategory createProductCategory(AddProductCategoryRequest productCategory);

    /**
     * Updates a product category.
     *
     * @param id The product category's ID.
     * @param productCategory The updated product category.
     * @return The updated product category.
     */
    ProductCategory updateProductCategory(Long id, UpdateProductCategoryRequest productCategory);

    /**
     * Deletes a product category.
     *
     * @param id The product category's ID.
     */
    void deleteProductCategory(Long id);
}

package es.jose.backend.services;

import es.jose.backend.persistence.entities.ProductEntity;

import org.openapitools.model.AddProductRequest;
import org.openapitools.model.Product;
import org.openapitools.model.UpdateProductRequest;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductService {

    /**
     * Gets all products from the database. Optionally can be filtered by a product category's ID.
     *
     * @param productCategoryId Filter by product category id.
     * @return List of products.
     */
    List<Product> getAllProducts(Optional<Long> productCategoryId);

    /**
     * Gets a product by id.
     *
     * @param id Product id.
     * @return Product.
     */
    Product getProductById(Long id);

    /**
     * Gets a product entity by id.
     *
     * @param id Product id.
     * @return Product entity.
     */
    ProductEntity getProductEntityById(Long id);

    /**
     * Creates a new product.
     *
     * @param product Product to create.
     * @return Created product.
     */
    Product createProduct(AddProductRequest product);

    /**
     * Updates a product.
     *
     * @param id Product id.
     * @param product Product to update.
     * @return Updated product.
     */
    Product updateProduct(Long id, UpdateProductRequest product);

    /**
     * Deletes a product.
     *
     * @param id Product id.
     */
    void deleteProduct(Long id);

    /**
     * Updates a product's image.
     *
     * @param id Product id.
     * @param img Image to update.
     * @return Updated product.
     */
    Product updateCourseImage(Long id, MultipartFile img);

    /**
     * Removes a product's image.
     *
     * @param id Product id.
     * @return Updated product.
     */
    Product removeCourseImage(Long id);
}

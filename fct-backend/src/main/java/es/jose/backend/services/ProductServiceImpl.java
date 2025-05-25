package es.jose.backend.services;

import es.jose.backend.mappers.ProductMapper;
import es.jose.backend.persistence.entities.ProductEntity;
import es.jose.backend.persistence.repositories.ProductRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddProductRequest;
import org.openapitools.model.Product;
import org.openapitools.model.UpdateProductRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing products. Provides methods for retrieving, creating,
 * updating, and deleting products, as well as managing product images. Interacts with the
 * ProductRepository, ProductCategoryService, and StorageService.
 */
@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductMapper productMapper;
    private final StorageService storageService;
    private final ProductRepository productRepository;
    private final ProductCategoryService productCategoryService;

    /**
     * Gets all products from the database. Optionally can be filtered by a product category's ID.
     *
     * @param productCategoryId Filter by product category id.
     * @return List of products.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts(Optional<Long> productCategoryId) {
        return productCategoryId
                .map(productCategoryService::getProductCategoryEntityById)
                .map(
                        productCategoryEntity ->
                                productRepository.findAllByProductCategory(productCategoryEntity))
                .orElseGet(productRepository::findAll)
                .stream()
                .map(productMapper::toDto)
                .toList();
    }

    /**
     * Gets a product by id.
     *
     * @param id Product id.
     * @return Product.
     * @throws EntityNotFoundException if no product is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public Product getProductById(Long id) {
        return productRepository
                .findById(id)
                .map(productMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    /**
     * Gets a product entity by id.
     *
     * @param id Product id.
     * @return Product entity.
     * @throws EntityNotFoundException if no product entity is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public ProductEntity getProductEntityById(Long id) {
        return productRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    /**
     * Creates a new product. Retrieves the associated product category entity and sets it in the
     * product entity before saving. Checks for uniqueness by name before saving.
     *
     * @param product Product to create.
     * @return Created product.
     * @throws EntityNotFoundException if the product category specified in the request is not
     *     found.
     * @throws EntityExistsException if a product with the same name already exists.
     */
    @Override
    @Transactional
    public Product createProduct(AddProductRequest product) {
        var productCategory =
                productCategoryService.getProductCategoryEntityById(product.productCategoryId());
        return Optional.ofNullable(product)
                .filter(p -> !productRepository.existsByName(product.name()))
                .map(productMapper::toEntity)
                .map(
                        p -> {
                            p.setProductCategory(productCategory);
                            return productRepository.save(p);
                        })
                .map(productMapper::toDto)
                .orElseThrow(
                        () -> new EntityExistsException("Product with name " + product.name()));
    }

    /**
     * Updates a product. Finds the existing entity, updates its properties based on the request
     * DTO, saves it, and returns the updated DTO.
     *
     * @param id Product id.
     * @param product Product to update.
     * @return Updated product.
     * @throws EntityNotFoundException if no product is found with the given ID.
     */
    @Override
    @Transactional
    public Product updateProduct(Long id, UpdateProductRequest product) {
        return productRepository
                .findById(id)
                .map(
                        entity -> {
                            productMapper.updateEntity(product, entity);
                            return entity;
                        })
                .map(productRepository::save)
                .map(productMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    /**
     * Deletes a product.
     *
     * @param id Product id.
     * @throws EntityNotFoundException if no product is found with the given ID.
     */
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        productRepository
                .findById(id)
                .ifPresentOrElse(
                        (productRepository::delete),
                        () -> {
                            throw new EntityNotFoundException(
                                    "Product with id " + id + " not found");
                        });
    }

    /**
     * Updates a product's image. Stores the provided image file and updates the product entity's
     * image name.
     *
     * @param id Product id.
     * @param img Image to update.
     * @return Updated product.
     * @throws EntityNotFoundException if no product is found with the given ID.
     * @throws RuntimeException if there is an issue storing the file.
     */
    @Override
    @Transactional
    public Product updateCourseImage(Long id, MultipartFile img) {
        return productRepository
                .findById(id)
                .map(
                        p -> {
                            p.setImageName(storageService.storeFile(img));
                            return p;
                        })
                .map(productRepository::save)
                .map(productMapper::toDto)
                .orElseThrow(
                        () -> new EntityNotFoundException("Course with id " + id + " not found"));
    }

    /**
     * Removes a product's image. Sets the product entity's image name to null.
     *
     * @param id Product id.
     * @return Updated product.
     * @throws EntityNotFoundException if no product is found with the given ID.
     */
    @Override
    @Transactional
    public Product removeCourseImage(Long id) {
        return productRepository
                .findById(id)
                .map(
                        p -> {
                            p.setImageName(null);
                            return productRepository.save(p);
                        })
                .map(productMapper::toDto)
                .orElseThrow(
                        () -> new EntityNotFoundException("Course with id " + id + " not found"));
    }
}

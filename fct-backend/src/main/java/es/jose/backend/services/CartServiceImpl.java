package es.jose.backend.services;

import es.jose.backend.mappers.CartMapper;
import es.jose.backend.persistence.entities.CartEntity;
import es.jose.backend.persistence.entities.keys.CartKey;
import es.jose.backend.persistence.repositories.CartRepository;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.Cart;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing user shopping carts. Provides methods for retrieving carts,
 * adding/updating/removing products in a cart. Interacts with the CartRepository, UserService, and
 * ProductService.
 */
@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartMapper cartMapper;
    private final UserService userService;
    private final ProductService productService;
    private final CartRepository cartRepository;

    /**
     * Gets all carts from the database. Optionally can be filtered by a user's ID.
     *
     * @param userId The user's ID.
     * @return A list of carts.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Cart> getAllCarts(Optional<Long> userId) {
        return userId
                .map(userService::getUserEntityById)
                .map(cartRepository::findAllByUser)
                .orElseGet(cartRepository::findAll)
                .stream()
                .map(cartMapper::toDto)
                .toList();
    }

    /**
     * Adds a {@code Product} to the user's cart. If the product is already in the cart, its
     * quantity is incremented by one.
     *
     * @param userId The user's ID.
     * @param productId The product's ID.
     * @return The updated cart.
     * @throws jakarta.persistence.EntityNotFoundException if the user or product is not found.
     */
    @Override
    @Transactional
    public Cart addProductToCart(Long userId, Long productId) {
        var product = productService.getProductEntityById(productId);
        var user = userService.getUserEntityById(userId);

        var key = new CartKey(userId, productId);

        // Check if the item already exists in the cart
        Optional<CartEntity> existingCartItem = cartRepository.findById(key);

        if (existingCartItem.isPresent()) {
            // If exists, increment quantity
            CartEntity entity = existingCartItem.get();
            entity.setQuantity(entity.getQuantity() + 1);
            return cartMapper.toDto(cartRepository.save(entity));
        } else {
            // If not exists, create a new entry
            return Optional.ofNullable(
                            CartEntity.builder()
                                    .id(key)
                                    .user(user)
                                    .product(product)
                                    .quantity(1)
                                    .build())
                    .map(cartRepository::save)
                    .map(cartMapper::toDto)
                    .get();
        }
    }

    /**
     * Updates the quantity of a product in the user's cart.
     *
     * @param userId The user's ID.
     * @param productId The product's ID.
     * @param quantity The new quantity.
     * @return The updated cart.
     * @throws EntityNotFoundException if the cart item for the given user and product is not found.
     */
    @Override
    @Transactional
    public Cart updateCart(Long userId, Long productId, Integer quantity) {
        var key = new CartKey(userId, productId);
        return cartRepository
                .findById(key)
                .map(
                        entity -> {
                            entity.setQuantity(quantity);
                            return entity;
                        })
                .map(cartRepository::save)
                .map(cartMapper::toDto)
                .orElseThrow(
                        () -> new EntityNotFoundException("Cart with id " + key + " not found"));
    }

    /**
     * Removes a product from the user's cart.
     *
     * @param userId The user's ID.
     * @param productId The product's ID.
     * @throws EntityNotFoundException if the cart item for the given user and product is not found.
     */
    @Override
    @Transactional
    public void removeProductFromCart(Long userId, Long productId) {
        var key = new CartKey(userId, productId);
        cartRepository
                .findById(key)
                .ifPresentOrElse(
                        cartRepository::delete,
                        () -> {
                            throw new EntityNotFoundException("Cart with id " + key + " not found");
                        });
    }
}

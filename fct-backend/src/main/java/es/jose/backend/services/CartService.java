package es.jose.backend.services;

import org.openapitools.model.Cart;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing user shopping carts. Provides methods for retrieving carts,
 * adding/updating/removing products in a cart.
 */
public interface CartService {

    /**
     * Gets all carts from the database. Optionally can be filtered by a user's ID.
     *
     * @param userId The user's ID.
     * @return A list of carts.
     */
    List<Cart> getAllCarts(Optional<Long> userId);

    /**
     * Adds a {@code Product} to the user's cart.
     *
     * @param userId The user's ID.
     * @param productId The product's ID.
     * @return The updated cart.
     */
    Cart addProductToCart(Long userId, Long productId);

    /**
     * Updates the quantity of a product in the user's cart.
     *
     * @param userId The user's ID.
     * @param productId The product's ID.
     * @param quantity The new quantity.
     * @return The updated cart.
     */
    Cart updateCart(Long userId, Long productId, Integer quantity);

    /**
     * Removes a product from the user's cart.
     *
     * @param userId The user's ID.
     * @param productId The product's ID.
     */
    void removeProductFromCart(Long userId, Long productId);
}

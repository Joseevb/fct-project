package es.jose.backend.controllers;

import es.jose.backend.services.CartService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.CartsApi;
import org.openapitools.model.Cart;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class CartController implements CartsApi {

    private final CartService cartService;

    @Override
    public ResponseEntity<Cart> addCart(
            @NotNull @Valid Long userId, @NotNull @Valid Long productId) {
        var cart = cartService.addProductToCart(userId, productId);
        return ResponseEntity.created(URI.create("/api/v1/carts/" + cart.userId())).body(cart);
    }

    @Override
    public ResponseEntity<List<Cart>> getAllCarts(@Valid Optional<Long> userId) {
        return ResponseEntity.ok(cartService.getAllCarts(userId));
    }

    @Override
    public ResponseEntity<Void> removeProductFromCart(Long userId, Long productId) {
        cartService.removeProductFromCart(userId, productId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Cart> updateCart(
            @NotNull @Valid Long userId,
            @NotNull @Valid Long productId,
            @NotNull @Min(1) @Valid Integer quantity) {
        var cart = cartService.updateCart(userId, productId, quantity);
        return ResponseEntity.created(URI.create("/api/v1/carts/" + cart.userId())).body(cart);
    }
}

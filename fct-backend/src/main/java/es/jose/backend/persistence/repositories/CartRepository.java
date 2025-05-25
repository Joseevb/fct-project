package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.CartEntity;
import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.entities.keys.CartKey;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<CartEntity, CartKey> {

    List<CartEntity> findAllByUser(UserEntity user);
}

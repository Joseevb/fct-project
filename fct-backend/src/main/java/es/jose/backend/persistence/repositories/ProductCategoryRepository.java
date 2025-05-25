package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.ProductCategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, Long> {
    Boolean existsByName(String name);
}

package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.ProductCategoryEntity;
import es.jose.backend.persistence.entities.ProductEntity;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    List<ProductEntity> findAllByProductCategory(ProductCategoryEntity productCategory);

    Boolean existsByName(String name);
}

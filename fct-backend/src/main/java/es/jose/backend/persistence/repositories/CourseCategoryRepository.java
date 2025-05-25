package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.CourseCategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseCategoryRepository extends JpaRepository<CourseCategoryEntity, Long> {
    boolean existsByName(String name);
}

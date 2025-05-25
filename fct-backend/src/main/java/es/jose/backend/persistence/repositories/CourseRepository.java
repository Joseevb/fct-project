package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.CourseEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<CourseEntity, Long> {

    /**
     * Finds all course entities associated with a given category ID.
     *
     * @param categoryId The ID of the category to search for.
     * @return A set of CourseEntity objects belonging to the specified category.
     */
    List<CourseEntity> findByCategoryId(Long categoryId);

    /**
     * Finds all CourseEntity instances that have the given UserEntity in their 'users' collection.
     * This leverages the ManyToMany relationship defined in CourseEntity.
     *
     * @param user The UserEntity to search for.
     * @return A Set of CourseEntity instances associated with the user.
     */
    // List<CourseEntity> findByUsersContaining(UserEntity user);
}

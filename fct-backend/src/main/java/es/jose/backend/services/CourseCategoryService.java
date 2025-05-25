package es.jose.backend.services;

import org.openapitools.model.AddCourseCategoryRequest;
import org.openapitools.model.CourseCategory;
import org.openapitools.model.UpdateCourseCategoryRequest;

import java.util.List;

/**
 * Service interface for managing course categories. Provides methods for retrieving, creating,
 * updating, and deleting course categories.
 */
public interface CourseCategoryService {

    /**
     * Retrieves a list of all course categories in the system.
     *
     * @return a list of CourseCategory DTOs.
     */
    List<CourseCategory> getAllCourseCategories();

    /**
     * Retrieves a specific course category by its unique identifier.
     *
     * @param id The ID of the course category to retrieve.
     * @return the CourseCategory DTO corresponding to the given ID.
     */
    CourseCategory getCourseCategoryById(Long id);

    /**
     * Updates an existing course category identified by its unique identifier.
     *
     * @param id The ID of the course category to update.
     * @param request The UpdateCourseCategoryRequest containing the updated details for the
     *     category.
     * @return the updated CourseCategory DTO.
     */
    CourseCategory updateCourseCategory(Long id, UpdateCourseCategoryRequest request);

    /**
     * Deletes a course category identified by its unique identifier.
     *
     * @param id The ID of the course category to delete.
     */
    void deleteCourseCategory(Long id);

    /**
     * Adds a new course category.
     *
     * @param request The AddCourseCategoryRequest containing the details for the new category.
     * @return the newly created CourseCategory DTO.
     */
    CourseCategory addCourseCategory(AddCourseCategoryRequest request);
}

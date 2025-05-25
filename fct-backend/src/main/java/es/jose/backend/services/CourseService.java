package es.jose.backend.services;

import es.jose.backend.persistence.entities.CourseEntity;

import org.openapitools.model.AddCourseRequest;
import org.openapitools.model.Course;
import org.openapitools.model.CourseUser;
import org.openapitools.model.UpdateCourseRequest;
import org.openapitools.model.UserCourseEnrollmentStatusEnum;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing courses. Provides methods for retrieving, creating, updating,
 * deleting courses, managing course images, and handling user enrollments in courses.
 */
public interface CourseService {

    /**
     * Retrieves a list of all courses, optionally filtered by user or category.
     *
     * @param userId Optional ID of the user to filter courses by.
     * @param categoryId Optional ID of the category to filter courses by.
     * @return A list of Course DTOs containing the filtered courses.
     */
    List<Course> getAllCourses(Optional<Long> userId, Optional<Long> categoryId);

    /**
     * Retrieves a specific course by its unique identifier.
     *
     * @param id The unique identifier of the course to retrieve.
     * @return The Course DTO matching the given ID.
     */
    Course getCourseById(Long id);

    /**
     * Retrieves a specific course entity by its unique identifier.
     *
     * @param id The unique identifier of the course entity to retrieve.
     * @return The CourseEntity matching the given ID.
     */
    CourseEntity getCourseEntityById(Long id);

    /**
     * Adds a user to a course.
     *
     * @param courseId The unique identifier of the course to add the user to.
     * @param userId The unique identifier of the user to add to the course.
     * @return The CourseUser DTO representing the relationship between the user and the course.
     */
    CourseUser addUserToCourse(Long courseId, Long userId);

    /**
     * Updates the status of a user on a course.
     *
     * @param courseId The unique identifier of the course to update.
     * @param userId The unique identifier of the user to update.
     * @param status The new status for the user's enrollment.
     * @return The updated CourseUser DTO.
     */
    CourseUser updateUserStatusOnCourse(
            Long courseId, Long userId, UserCourseEnrollmentStatusEnum status);

    /**
     * Creates a new course.
     *
     * @param course The AddCourseRequest containing the details of the course to create.
     * @return The newly created Course DTO.
     */
    Course createCourse(AddCourseRequest course);

    /**
     * Updates an existing course identified by its unique identifier.
     *
     * @param id The unique identifier of the course to update.
     * @param course The UpdateCourseRequest containing the updated details for the course.
     * @return The updated Course DTO.
     */
    Course updateCourse(Long id, UpdateCourseRequest course);

    /**
     * Deletes a course identified by its unique identifier.
     *
     * @param id The unique identifier of the course to delete.
     */
    void deleteCourse(Long id);

    /**
     * Updates the image of a course.
     *
     * @param id The unique identifier of the course to update.
     * @param img The MultipartFile object containing the updated image for the course.
     * @return The updated Course DTO.
     */
    Course updateCourseImage(Long id, MultipartFile img);

    /**
     * Removes a specific image from a course.
     *
     * @param id The unique identifier of the course to update.
     * @param imgName The name of the image to remove.
     * @return The updated Course DTO.
     */
    Course removeCourseImage(Long id, String imgName);
}

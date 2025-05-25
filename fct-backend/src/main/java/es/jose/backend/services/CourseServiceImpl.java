package es.jose.backend.services;

import es.jose.backend.mappers.CourseMapper;
import es.jose.backend.mappers.CourseUserMapper;
import es.jose.backend.persistence.entities.CourseEntity;
import es.jose.backend.persistence.entities.CourseUserEntity;
import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.entities.keys.CourseUserEntityKey;
import es.jose.backend.persistence.repositories.CourseCategoryRepository;
import es.jose.backend.persistence.repositories.CourseRepository;
import es.jose.backend.persistence.repositories.CourseUserRepository;

import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.AddCourseRequest;
import org.openapitools.model.Course;
import org.openapitools.model.CourseUser;
import org.openapitools.model.UpdateCourseRequest;
import org.openapitools.model.UserCourseEnrollmentStatusEnum;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing courses. Provides methods for retrieving, creating, updating,
 * deleting courses, managing course images, and handling user enrollments in courses. Interacts
 * with various repositories and services including CourseRepository, UserRepository,
 * StorageService, etc.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final UserService userService;
    private final CourseMapper courseMapper;
    private final StorageService storageService;
    private final CourseUserMapper courseUserMapper;
    private final CourseRepository courseRepository;
    private final CourseUserRepository courseUserRepository;
    private final CourseCategoryRepository courseCategoryRepository;

    /**
     * Retrieves a list of all courses, optionally filtered by user or category.
     *
     * @param userId Optional ID of the user to filter courses by.
     * @param categoryId Optional ID of the category to filter courses by.
     * @return A list of Course DTOs containing the filtered courses.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Course> getAllCourses(Optional<Long> userId, Optional<Long> categoryId) {
        return userId
                .map(courseUserRepository::findByUser_Id)
                .map(courseUser -> courseUser.stream().map(CourseUserEntity::getCourse).toList())
                .orElse(
                        categoryId
                                .map(courseRepository::findByCategoryId)
                                .orElse(courseRepository.findAll()))
                .stream()
                .map(courseMapper::toDto)
                .toList();
    }

    /**
     * Retrieves a specific course by its unique identifier.
     *
     * @param id The unique identifier of the course to retrieve.
     * @return The Course DTO matching the given ID.
     * @throws EntityNotFoundException if no course is found with the given ID.
     */
    @Override
    public Course getCourseById(Long id) {
        return courseRepository
                .findById(id)
                .map(courseMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    /**
     * Retrieves a specific course entity by its unique identifier.
     *
     * @param id The unique identifier of the course entity to retrieve.
     * @return The CourseEntity matching the given ID.
     * @throws EntityNotFoundException if no course entity is found with the given ID.
     */
    @Override
    public CourseEntity getCourseEntityById(Long id) {
        return courseRepository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    /**
     * Creates a new course. Retrieves the associated course category entity and sets it in the
     * course entity before saving.
     *
     * @param course The AddCourseRequest containing the details of the course to create.
     * @return The newly created Course DTO.
     * @throws EntityNotFoundException if the course category specified in the request is not found.
     */
    @Override
    public Course createCourse(AddCourseRequest course) {
        return courseCategoryRepository
                .findById(course.categoryId())
                .map(
                        cat -> {
                            var courseEntity = courseMapper.toEntity(course);
                            courseEntity.setCategory(cat);
                            return courseRepository.save(courseEntity);
                        })
                .map(courseMapper::toDto)
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "Category with id " + course.categoryId() + " not found"));
    }

    /**
     * Updates an existing course identified by its unique identifier. Finds the existing entity,
     * updates its properties based on the request DTO, saves it, and returns the updated DTO.
     *
     * @param id The unique identifier of the course to update.
     * @param course The UpdateCourseRequest containing the updated details for the course.
     * @return The updated Course DTO.
     * @throws EntityNotFoundException if no course is found with the given ID.
     */
    @Override
    public Course updateCourse(Long id, UpdateCourseRequest course) {
        return courseRepository
                .findById(id)
                .map(
                        entity -> {
                            courseMapper.updateEntity(course, entity);
                            return entity;
                        })
                .map(courseRepository::save)
                .map(courseMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    /**
     * Deletes a course identified by its unique identifier.
     *
     * @param id The unique identifier of the course to delete.
     * @throws EntityNotFoundException if no course is found with the given ID.
     */
    @Override
    public void deleteCourse(Long id) {
        courseRepository
                .findById(id)
                .ifPresentOrElse(
                        (courseRepository::delete),
                        () -> {
                            throw new EntityNotFoundException(
                                    "Course with id " + id + " not found");
                        });
    }

    /**
     * Adds a user to a course. Retrieves the user and course entities, creates a new
     * CourseUserEntity, saves it, and returns the corresponding DTO.
     *
     * @param courseId The unique identifier of the course to add the user to.
     * @param userId The unique identifier of the user to add to the course.
     * @return The CourseUser DTO representing the relationship between the user and the course.
     * @throws EntityNotFoundException if the user or course is not found.
     */
    @Override
    public CourseUser addUserToCourse(Long courseId, Long userId) {
        var user = userService.getUserEntityById(userId);

        log.info("CourseId: {}, UserId: {}", courseId, userId);
        return courseRepository
                .findById(courseId)
                .map(
                        c -> {
                            log.info("CourseEntity: {}", c);
                            return c;
                        })
                .map(course -> createCourseUserEntity(course, user))
                .map(courseUserRepository::save)
                .map(courseUserMapper::toDto)
                .map(
                        e -> {
                            log.info("CourseUserEntity: {}, created", e);
                            return e;
                        })
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "Course with id " + courseId + " not found"));
    }

    /**
     * Updates the status of a user on a course. Finds the existing CourseUserEntity, updates its
     * status, saves it, and returns the updated DTO.
     *
     * @param courseId The unique identifier of the course.
     * @param userId The unique identifier of the user.
     * @param status The new status for the user's enrollment.
     * @return The updated CourseUser DTO.
     * @throws EntityNotFoundException if the CourseUser relationship for the given user and course
     *     is not found.
     */
    @Override
    public CourseUser updateUserStatusOnCourse(
            Long courseId, Long userId, UserCourseEnrollmentStatusEnum status) {
        return courseUserRepository
                .findByUserIdAndCourseId(userId, courseId)
                .map(
                        entity -> {
                            entity.setStatus(status);
                            return entity;
                        })
                .map(courseUserRepository::save)
                .map(courseUserMapper::toDto)
                .orElseThrow(
                        () ->
                                new EntityNotFoundException(
                                        "CourseUser with userId "
                                                + userId
                                                + " and courseId "
                                                + courseId
                                                + " not found"));
    }

    /**
     * Updates the image of a course. Stores the provided image file and updates the course entity's
     * image name.
     *
     * @param id The unique identifier of the course to update.
     * @param img The MultipartFile object containing the updated image for the course.
     * @return The updated Course DTO.
     * @throws EntityNotFoundException if no course is found with the given ID.
     * @throws RuntimeException if there is an issue storing the file.
     */
    @Override
    @Transactional
    public Course updateCourseImage(Long id, MultipartFile img) {
        return courseRepository
                .findById(id)
                .map(
                        c -> {
                            c.getImgNames().add(storageService.storeFile(img));
                            return c;
                        })
                .map(courseRepository::save)
                .map(courseMapper::toDto)
                .orElseThrow(
                        () -> new EntityNotFoundException("Course with id " + id + " not found"));
    }

    /**
     * Removes a specific image from a course. Removes the image name from the course entity's image
     * list and saves the changes.
     *
     * @param id The unique identifier of the course to update.
     * @param imgName The name of the image to remove.
     * @return The updated Course DTO.
     * @throws EntityNotFoundException if no course is found with the given ID.
     */
    @Override
    public Course removeCourseImage(Long id, String imgName) {
        return courseRepository
                .findById(id)
                .map(
                        course -> {
                            course.getImgNames().remove(imgName);
                            return courseRepository.save(course);
                        })
                .map(courseMapper::toDto)
                .orElseThrow(
                        () -> new EntityNotFoundException("Course with id " + id + " not found"));
    }

    /**
     * Creates a new CourseUserEntity instance.
     *
     * @param course The CourseEntity to link.
     * @param user The UserEntity to link.
     * @return The newly created CourseUserEntity.
     */
    private CourseUserEntity createCourseUserEntity(CourseEntity course, UserEntity user) {
        var key =
                CourseUserEntityKey.builder().userId(user.getId()).courseId(course.getId()).build();

        var entity =
                CourseUserEntity.builder()
                        .course(course)
                        .user(user)
                        .id(key)
                        .status(UserCourseEnrollmentStatusEnum.WAITING)
                        .build();
        log.info("CourseUserEntity: {}, created with key {}", entity, key);
        return entity;
    }
}

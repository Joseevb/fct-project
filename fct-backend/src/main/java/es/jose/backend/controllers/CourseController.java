package es.jose.backend.controllers;

import es.jose.backend.services.CourseService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.api.CoursesApi;
import org.openapitools.model.AddCourseRequest;
import org.openapitools.model.Course;
import org.openapitools.model.CourseUser;
import org.openapitools.model.UpdateCourseRequest;
import org.openapitools.model.UpdateUserStatusOnCourseRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CourseController implements CoursesApi {

    private final CourseService courseService;
    private final NativeWebRequest request;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.ofNullable(request);
    }

    @Override
    public ResponseEntity<Course> addCourse(@Valid AddCourseRequest addCourseRequest) {
        var course = courseService.createCourse(addCourseRequest);
        return ResponseEntity.created(URI.create("/api/v1/courses/" + course.id())).body(course);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCourse(Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Course>> getAllCourses(
            @Valid Optional<Long> userId, @Valid Optional<Long> categoryId) {
        return ResponseEntity.ok(courseService.getAllCourses(userId, categoryId));
    }

    @Override
    public ResponseEntity<Course> getCourseById(Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Course> updateCourse(
            Long id, @Valid UpdateCourseRequest updateCourseRequest) {
        var course = courseService.updateCourse(id, updateCourseRequest);
        return ResponseEntity.created(URI.create("/api/v1/courses/" + course.id())).body(course);
    }

    @Override
    public ResponseEntity<CourseUser> addUserToCourse(Long arg0, Long arg1) {
        var entity = courseService.addUserToCourse(arg0, arg1);
        return ResponseEntity.created(URI.create("/api/v1/courses/" + entity.courseId()))
                .body(entity);
    }

    @Override
    public ResponseEntity<CourseUser> updateUserStatusOnCourse(
            Long courseId, Long userId, @Valid UpdateUserStatusOnCourseRequest body) {
        log.info("Body: {}", body.status());

        var entity = courseService.updateUserStatusOnCourse(courseId, userId, body.status());
        return ResponseEntity.created(URI.create("/api/v1/courses/" + entity.courseId()))
                .body(entity);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Course> updateCourseImage(Long id, MultipartFile img) {
        var course = courseService.updateCourseImage(id, img);
        return ResponseEntity.created(URI.create("/api/v1/courses/" + course.id())).body(course);
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> removeCourseImage(Long id, @NotNull @Valid String imgName) {
        courseService.removeCourseImage(id, imgName);
        return ResponseEntity.noContent().build();
    }
}

package es.jose.backend.controllers;

import es.jose.backend.services.CourseCategoryService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.CourseCategoriesApi;
import org.openapitools.model.AddCourseCategoryRequest;
import org.openapitools.model.CourseCategory;
import org.openapitools.model.UpdateCourseCategoryRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class CourseCategoryController implements CourseCategoriesApi {

    private final CourseCategoryService service;

    @Override
    public ResponseEntity<CourseCategory> createCourseCategory(
            @Valid AddCourseCategoryRequest addCourseCategoryRequest) {
        var res = service.addCourseCategory(addCourseCategoryRequest);
        return ResponseEntity.created(URI.create("/api/v1/courses" + res.id())).body(res);
    }

    @Override
    public ResponseEntity<Void> deleteCourseCategory(Long id) {
        service.deleteCourseCategory(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<CourseCategory>> getAllCourseCategories() {
        return ResponseEntity.ok(service.getAllCourseCategories());
    }

    @Override
    public ResponseEntity<CourseCategory> getCourseCategoryById(Long id) {
        return ResponseEntity.ok(service.getCourseCategoryById(id));
    }

    @Override
    public ResponseEntity<CourseCategory> updateCourseCategory(
            Long id, @Valid UpdateCourseCategoryRequest updateCourseCategoryRequest) {
        var res = service.updateCourseCategory(id, updateCourseCategoryRequest);
        return ResponseEntity.created(URI.create("/api/v1/courses" + res.id())).body(res);
    }
}

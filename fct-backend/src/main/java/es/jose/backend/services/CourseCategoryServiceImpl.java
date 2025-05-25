package es.jose.backend.services;

import es.jose.backend.mappers.CourseCategoryMapper;
import es.jose.backend.persistence.repositories.CourseCategoryRepository;

import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddCourseCategoryRequest;
import org.openapitools.model.CourseCategory;
import org.openapitools.model.UpdateCourseCategoryRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseCategoryServiceImpl implements CourseCategoryService {

    private final CourseCategoryMapper courseCategoryMapper;
    private final CourseCategoryRepository courseCategoryRepository;

    @Override
    public List<CourseCategory> getAllCourseCategories() {
        return courseCategoryRepository.findAll().stream()
                .map(courseCategoryMapper::toDto)
                .toList();
    }

    @Override
    public CourseCategory getCourseCategoryById(Long id) {
        return courseCategoryRepository
                .findById(id)
                .map(courseCategoryMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    @Override
    public CourseCategory updateCourseCategory(Long id, UpdateCourseCategoryRequest request) {
        return courseCategoryRepository
                .findById(id)
                .map(
                        entity -> {
                            courseCategoryMapper.updateEntity(request, entity);
                            return entity;
                        })
                .map(courseCategoryRepository::save)
                .map(courseCategoryMapper::toDto)
                .orElseThrow(() -> new EntityNotFoundException("id" + id.toString()));
    }

    @Override
    public void deleteCourseCategory(Long id) {
        courseCategoryRepository
                .findById(id)
                .ifPresentOrElse(
                        (courseCategoryRepository::delete),
                        () -> {
                            throw new EntityNotFoundException(
                                    "CourseCategory with id " + id + " not found");
                        });
    }

    @Override
    public CourseCategory addCourseCategory(AddCourseCategoryRequest request) {
        return Optional.of(request)
                .filter(this::isCourseCategoryUnique)
                .map(courseCategoryMapper::toEntity)
                .map(courseCategoryRepository::save)
                .map(courseCategoryMapper::toDto)
                .orElseThrow(() -> new EntityExistsException("name" + request.name()));
    }

    private boolean isCourseCategoryUnique(AddCourseCategoryRequest request) {
        return !courseCategoryRepository.existsByName(request.name());
    }
}

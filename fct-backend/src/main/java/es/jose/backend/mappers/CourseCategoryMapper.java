package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.CourseCategoryEntity;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.openapitools.model.AddCourseCategoryRequest;
import org.openapitools.model.CourseCategory;
import org.openapitools.model.UpdateCourseCategoryRequest;

@Mapper(componentModel = "spring")
public interface CourseCategoryMapper extends MapperUtils {

    CourseCategory toDto(CourseCategoryEntity entity);

    @Mapping(target = "id", ignore = true)
    CourseCategoryEntity toEntity(AddCourseCategoryRequest request);

    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(
            UpdateCourseCategoryRequest request, @MappingTarget CourseCategoryEntity entity);
}

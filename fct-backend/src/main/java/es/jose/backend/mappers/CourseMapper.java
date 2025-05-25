package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.CourseEntity;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.openapitools.model.AddCourseRequest;
import org.openapitools.model.Course;
import org.openapitools.model.UpdateCourseRequest;

@Mapper(componentModel = "spring")
public interface CourseMapper extends MapperUtils {

    @Mapping(target = "categoryId", source = "category.id")
    Course toDto(CourseEntity courseEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "imgNames", ignore = true)
    @Mapping(target = "courseUsers", ignore = true)
    CourseEntity toEntity(AddCourseRequest addCourseRequest);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "imgNames", ignore = true)
    @Mapping(target = "courseUsers", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateCourseRequest updateCourseRequest, @MappingTarget CourseEntity entity);
}

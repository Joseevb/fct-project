package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.CourseUserEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.CourseUser;

@Mapper(componentModel = "spring")
public interface CourseUserMapper extends MapperUtils {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "courseId", source = "course.id")
    CourseUser toDto(CourseUserEntity entity);
}

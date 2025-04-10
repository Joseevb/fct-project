package es.jose.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

@Mapper(componentModel = "spring")
public interface AppointmentCategoryMapper {

    AppointmentCategory toDto(AppointmentCategoryEntity entity);

    @Mapping(target = "id", ignore = true)
    AppointmentCategoryEntity toEntity(AddAppointmentCategoryRequest appointmentCategory);

}

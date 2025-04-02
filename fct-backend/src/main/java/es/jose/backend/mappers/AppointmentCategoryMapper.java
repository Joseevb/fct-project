package es.jose.backend.mappers;

import org.mapstruct.Mapper;
import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

@Mapper(componentModel = "spring")
public interface AppointmentCategoryMapper {

    AppointmentCategory toDto(AppointmentCategoryEntity entity);

    AppointmentCategoryEntity toEntity(AddAppointmentCategoryRequest appointmentCategory);

}

package es.jose.backend.mappers;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.AppointmentEntity;

@Mapper(componentModel = "spring")
public interface AppointmentMapper extends MapperUtils {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "categoryId", source = "category.id")
    Appointment toDto(AppointmentEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "status", constant = "WAITING")
    @Mapping(target = "category", ignore = true)
    AppointmentEntity toEntity(AddAppointmentRequest dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "price", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "category", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(UpdateAppointmentRequest dto, @MappingTarget AppointmentEntity entity);

}

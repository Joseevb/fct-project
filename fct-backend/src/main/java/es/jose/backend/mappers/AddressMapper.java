package es.jose.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.openapitools.model.AddAddressRequest;
import org.openapitools.model.Address;
import org.openapitools.model.UpdateAddressRequest;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.AddressEntity;

@Mapper(componentModel = "spring")
public interface AddressMapper extends MapperUtils {

    @Mapping(target = "userId", source = "user.id")
    Address toDto(AddressEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    AddressEntity toEntity(AddAddressRequest address);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(UpdateAddressRequest address, @MappingTarget AddressEntity entity);
}
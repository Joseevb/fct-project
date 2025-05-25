package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.InvoiceEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.UpdateInvoiceRequest;

@Mapper(componentModel = "spring")
public interface InvoiceMapper extends MapperUtils {

    @Mapping(target = "userId", source = "user.id")
    Invoice toDto(InvoiceEntity invoice);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lineItems", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "totalPrice", constant = "0")
    InvoiceEntity toEntity(AddInvoiceRequest invoice);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lineItems", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    void updateEntity(UpdateInvoiceRequest dto, @MappingTarget InvoiceEntity entity);
}

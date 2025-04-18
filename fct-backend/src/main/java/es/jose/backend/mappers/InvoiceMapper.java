package es.jose.backend.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.InvoiceEntity;

@Mapper(componentModel = "spring")
public interface InvoiceMapper extends MapperUtils {

    @Mapping(target = "userId", source = "user.id")
    Invoice toDto(InvoiceEntity invoice);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lineItems", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "totalPrice", ignore = true)
    InvoiceEntity toEntity(AddInvoiceRequest invoice);

}

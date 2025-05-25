package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.LineItemEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.AddLineItemRequest;
import org.openapitools.model.LineItem;

@Mapper(componentModel = "spring")
public interface LineItemMapper extends MapperUtils {

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "invoiceId", source = "invoice.id")
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "appointmentId", source = "appointment.id")
    LineItem toDto(LineItemEntity entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    @Mapping(target = "invoice", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "subtotal", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "appointment", ignore = true)
    @Mapping(target = "priceAtPurchase", ignore = true)
    LineItemEntity toEntity(AddLineItemRequest lineItem);
}

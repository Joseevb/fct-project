package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.CartEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.openapitools.model.Cart;

@Mapper(componentModel = "spring")
public interface CartMapper extends MapperUtils {

    @Mapping(target = "userId", source = "id.userId")
    @Mapping(target = "productId", source = "id.productId")
    Cart toDto(CartEntity entity);
}

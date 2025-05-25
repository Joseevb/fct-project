package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.ProductEntity;

import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.openapitools.model.AddProductRequest;
import org.openapitools.model.Product;
import org.openapitools.model.UpdateProductRequest;

@Mapper(componentModel = "spring")
public interface ProductMapper extends MapperUtils {

    Product toDto(ProductEntity productEntity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "imageName", ignore = true)
    @Mapping(target = "productCategory", ignore = true)
    ProductEntity toEntity(AddProductRequest product);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "imageName", ignore = true)
    @Mapping(target = "productCategory", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(
            UpdateProductRequest updateProductRequest, @MappingTarget ProductEntity entity);
}

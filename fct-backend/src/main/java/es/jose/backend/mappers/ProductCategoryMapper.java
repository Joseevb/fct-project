package es.jose.backend.mappers;

import es.jose.backend.mappers.util.MapperUtils;
import es.jose.backend.persistence.entities.ProductCategoryEntity;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.openapitools.model.AddProductCategoryRequest;
import org.openapitools.model.ProductCategory;
import org.openapitools.model.UpdateProductCategoryRequest;

@Mapper(componentModel = "spring")
public interface ProductCategoryMapper extends MapperUtils {

    ProductCategory toDto(ProductCategoryEntity entity);

    @Mapping(target = "id", ignore = true)
    ProductCategoryEntity toEntity(AddProductCategoryRequest dto);

    @Mapping(target = "id", ignore = true)
    void updateEntity(
            UpdateProductCategoryRequest dto, @MappingTarget ProductCategoryEntity entity);
}

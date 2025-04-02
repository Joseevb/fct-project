package es.jose.backend.validation;

import es.jose.backend.annotations.ExactlyOneIdPresent;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.Objects;
import java.util.Optional;
import org.springframework.beans.BeanWrapperImpl;

@Slf4j
public class ExactlyOneIdValidator implements ConstraintValidator<ExactlyOneIdPresent, Object> {

    private String[] fieldNames;

    @Override
    public void initialize(ExactlyOneIdPresent constraintAnnotation) {
        this.fieldNames = constraintAnnotation.fields();
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        final BeanWrapperImpl beanWrapper = new BeanWrapperImpl(value);
        long presentCount = Arrays.stream(fieldNames)
                .map(fieldName -> {
                    try {
                        Object propertyValue = beanWrapper.getPropertyValue(fieldName);

                        if (propertyValue instanceof Optional) {
                            return ((Optional<?>) propertyValue).isPresent();
                        } else {
                            return Objects.nonNull(propertyValue);
                        }
                    } catch (Exception e) {
                        log.error("Error accessing field '{}' for validation: {}", fieldName, e.getMessage());
                        return false;
                    }
                })
                .filter(isPresent -> isPresent)
                .count();

        return presentCount == 1;
    }
}

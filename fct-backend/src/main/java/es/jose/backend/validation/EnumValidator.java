package es.jose.backend.validation;

import java.util.Arrays;
import java.util.stream.Collectors;

import es.jose.backend.annotations.ValidEnum;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class EnumValidator implements ConstraintValidator<ValidEnum, Object> {

    private String acceptedValues;
    private Enum<?>[] enumConstants;

    @Override
    public void initialize(ValidEnum annotation) {
        enumConstants = annotation.value().getEnumConstants();
        acceptedValues = Arrays.stream(enumConstants)
                .map(Enum::name)
                .collect(Collectors.joining(", "));
    }

    @Override
    public boolean isValid(Object value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        boolean isValid = Arrays.stream(enumConstants)
                .anyMatch(e -> e.equals(value));

        if (!isValid) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("Invalid value. Accepted values: " + acceptedValues)
                    .addConstraintViolation();
        }

        return isValid;
    }
}

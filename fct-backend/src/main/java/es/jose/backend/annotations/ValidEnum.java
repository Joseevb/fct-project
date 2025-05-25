package es.jose.backend.annotations;

import es.jose.backend.validation.EnumValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Documented
@Constraint(validatedBy = EnumValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidEnum {

    Class<? extends Enum<?>> value(); // Accepts the enum class

    String message() default "Invalid value. Accepted values: {acceptedValues}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

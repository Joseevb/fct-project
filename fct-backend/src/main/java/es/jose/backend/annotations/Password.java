package es.jose.backend.annotations;

import es.jose.backend.validation.PasswordValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME) // Available at runtime for validation
@Constraint(validatedBy = PasswordValidator.class) // Links to the validator class
public @interface Password {
    String message() default "password.error";

    Class<?>[] groups() default {}; // Required for grouping constraints

    Class<? extends Payload>[]
            payload() default {}; // Required for custom payloads (e.g., severity levels)
}

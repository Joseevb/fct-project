package es.jose.backend.annotations;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import es.jose.backend.validation.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.FIELD, ElementType.PARAMETER }) // Can be used on fields and method parameters
@Retention(RetentionPolicy.RUNTIME) // Available at runtime for validation
@Constraint(validatedBy = PasswordValidator.class) // Links to the validator class
public @interface Password {
    String message() default "Invalid password. Must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.";

    Class<?>[] groups() default {}; // Required for grouping constraints

    Class<? extends Payload>[] payload() default {}; // Required for custom payloads (e.g., severity levels)
}

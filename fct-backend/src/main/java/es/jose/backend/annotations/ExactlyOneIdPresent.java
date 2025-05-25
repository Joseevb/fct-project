package es.jose.backend.annotations;

import es.jose.backend.validation.ExactlyOneIdValidator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ExactlyOneIdValidator.class)
@Documented
public @interface ExactlyOneIdPresent {
    String message() default
            "Exactly one of appointmentId, productId, or courseId must be provided.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String[] fields();
}

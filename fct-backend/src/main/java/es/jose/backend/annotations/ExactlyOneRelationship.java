package es.jose.backend.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import es.jose.backend.validation.ExactlyOneRelationshipValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Target({ ElementType.TYPE, ElementType.ANNOTATION_TYPE })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = ExactlyOneRelationshipValidator.class)
@Documented
public @interface ExactlyOneRelationship {
    String message() default "Exactly one of appointment, product, or course must be set.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}

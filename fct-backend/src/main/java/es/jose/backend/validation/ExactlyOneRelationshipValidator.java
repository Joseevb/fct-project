package es.jose.backend.validation;

import java.util.Objects;
import java.util.stream.Stream;

import es.jose.backend.annotations.ExactlyOneRelationship;
import es.jose.backend.persistence.entities.LineItemEntity;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ExactlyOneRelationshipValidator implements ConstraintValidator<ExactlyOneRelationship, LineItemEntity> {
    @Override
    public void initialize(ExactlyOneRelationship constraintAnnotation) {
    }

    @Override
    public boolean isValid(LineItemEntity lineItem, ConstraintValidatorContext context) {
        if (lineItem == null) {
            return true; // Or false depending on null handling strategy
        }
        // return Stream.of(lineItem.getAppointment(), lineItem.getProduct(),
        // lineItem.getCourse())
        return Stream.of(lineItem.getAppointment())
                .filter(Objects::nonNull)
                .count() == 1;
    }
}

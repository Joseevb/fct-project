package es.jose.backend.validation;

import java.util.regex.Pattern;

import es.jose.backend.annotations.Password;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordValidator implements ConstraintValidator<Password, String> {

    // Define the password pattern
    private static final String PASSWORD_PATTERN = "^[a-zA-Z0-9]{8,}";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    @Override
    public void initialize(Password constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            return false; // Password cannot be null
        }
        return pattern.matcher(password).matches();
    }
}

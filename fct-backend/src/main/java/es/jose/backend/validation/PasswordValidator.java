package es.jose.backend.validation;

import es.jose.backend.annotations.Password;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;

import java.util.regex.Pattern;

@Slf4j
@RequiredArgsConstructor
public class PasswordValidator implements ConstraintValidator<Password, String> {

    private final MessageSource messageSource;

    /**
     * Regular expression for password validation. It checks that the password contains - At least
     * one uppercase letter
     *
     * <ul>
     *   <li>At least one lowercase letter
     *   <li>At least one digit
     *   <li>At least one special character (@$!%*?&)
     * </ul>
     *
     * <p>The password must be at least 8 characters long.
     */
    private static final String PASSWORD_PATTERN =
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";

    private static final Pattern pattern = Pattern.compile(PASSWORD_PATTERN);

    @Override
    public void initialize(Password constraintAnnotation) {
        // No initialization needed
    }

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null || !pattern.matcher(password).matches()) {
            context.disableDefaultConstraintViolation();

            log.info("Locale: {}", LocaleContextHolder.getLocale());

            String message =
                    messageSource.getMessage(
                            "password.error", null, LocaleContextHolder.getLocale());

            log.info("Message: {}", message);
            context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
            return false;
        }
        return true;
    }
}

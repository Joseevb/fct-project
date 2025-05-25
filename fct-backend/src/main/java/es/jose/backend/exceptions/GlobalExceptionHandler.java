package es.jose.backend.exceptions;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import jakarta.servlet.http.HttpServletRequest;

import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.ErrorMessage;
import org.openapitools.model.ValidationErrorMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

/** GlobalExceptionHandler */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorMessage> handleValidationExceptions(
            final MethodArgumentNotValidException ex, final HttpServletRequest request) {

        final var errors =
                ex.getBindingResult().getFieldErrors().stream()
                        .collect(
                                Collectors.toMap(
                                        FieldError::getField,
                                        FieldError::getDefaultMessage,
                                        (existing, replacement) -> existing));

        return buildValidationErrorResponse(errors, request);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorMessage> handleAccessDeniedExceptions(
            final AccessDeniedException ex, final HttpServletRequest request) {
        return buildErrorResponse(
                ex.getMessage(), "Authorization failed", request, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public void handleInvalidEnumException(
            HttpMessageNotReadableException ex, HttpServletRequest request) throws BindException {

        if (ex.getCause() instanceof InvalidFormatException invalidFormatEx) {
            String fieldName = invalidFormatEx.getPath().get(0).getFieldName();

            FieldError fieldError =
                    new FieldError(
                            "requestBody",
                            fieldName,
                            "Invalid value. Accepted values: "
                                    + Arrays.asList(
                                            invalidFormatEx.getTargetType().getEnumConstants()));

            var bindingResult = new BeanPropertyBindingResult(null, "requestBody");
            bindingResult.addError(fieldError);

            throw new BindException(bindingResult);
        }

        throw ex; // If it's not an InvalidFormatException, let Spring handle it
    }

    private ResponseEntity<ErrorMessage> buildErrorResponse(
            String error, String message, HttpServletRequest request, HttpStatus status) {
        return ResponseEntity.status(status)
                .body(
                        ErrorMessage.builder()
                                .timestamp(OffsetDateTime.now())
                                .status(HttpStatus.UNAUTHORIZED.value())
                                .error(error)
                                .message(message)
                                .path(request.getRequestURI())
                                .build());
    }

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorMessage> handleLockedException(
            LockedException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse(
                "Your account is locked. Please contact support.", request);
    }

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorMessage> handleDisabledException(
            DisabledException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse("Your account is disabled.", request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorMessage> handleBadCredentials(
            BadCredentialsException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse("Invalid username or password.", request);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorMessage> handleAuthenticationException(
            AuthenticationException e, HttpServletRequest request) {
        return buildAuthenticationErrorResponse(
                "Authentication failed. Please try again.", request);
    }

    private <T> ResponseEntity<ValidationErrorMessage> buildValidationErrorResponse(
            Map<String, String> errors, HttpServletRequest request) {
        var res =
                ValidationErrorMessage.builder()
                        .timestamp(OffsetDateTime.now())
                        .status(HttpStatus.BAD_REQUEST.value())
                        .error("Validation Error")
                        .messages(errors)
                        .path(request.getRequestURI())
                        .build();
        return ResponseEntity.badRequest().body(res);
    }

    private ResponseEntity<ErrorMessage> buildAuthenticationErrorResponse(
            String error, HttpServletRequest request) {
        return buildErrorResponse(error, "Authentication Failed", request, HttpStatus.UNAUTHORIZED);
    }
}

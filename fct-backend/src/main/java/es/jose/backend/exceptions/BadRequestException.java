package es.jose.backend.exceptions;

import lombok.Getter;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    private static final String MESSAGE_KEY = "exception.badRequest";

    @Getter private final String msg;
    private final String defaultMessage;
    private final MessageSource messageSource;

    public BadRequestException(String message, MessageSource messageSource) {
        this.msg = message;
        this.defaultMessage = String.format("Invalid request: %s", message);
        this.messageSource = messageSource;
    }

    @Override
    public String getMessage() {
        if (messageSource == null) {
            return defaultMessage;
        }

        return messageSource.getMessage(
                MESSAGE_KEY, new Object[] {msg}, defaultMessage, LocaleContextHolder.getLocale());
    }
}

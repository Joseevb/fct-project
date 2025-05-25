package es.jose.backend.exceptions;

import lombok.Getter;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AlreadyExistsException extends RuntimeException {

    private static final String MESSAGE_KEY = "exception.alreadyExists";

    private final String resource;
    @Getter private final String identifier;
    private final String defaultMessage;
    private final MessageSource messageSource;

    public AlreadyExistsException(String resource, String identifier, MessageSource messageSource) {
        this.resource = resource;
        this.identifier = identifier;
        this.messageSource = messageSource;
        this.defaultMessage = String.format("A %s by that %s already exists", resource, identifier);
    }

    @Override
    public String getMessage() {
        if (messageSource == null) {
            return defaultMessage;
        }

        return messageSource.getMessage(
                MESSAGE_KEY,
                new Object[] {resource, identifier},
                defaultMessage,
                LocaleContextHolder.getLocale());
    }
}

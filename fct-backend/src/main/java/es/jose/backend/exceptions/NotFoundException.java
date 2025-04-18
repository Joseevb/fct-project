package es.jose.backend.exceptions;

import lombok.Getter;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

    private static final String MESSAGE_KEY = "exception.notFound";

    private final String resource;
    @Getter private final String identifier;
    @Getter private final String value;
    private final String defaultMessage;
    private final MessageSource messageSource;

    public NotFoundException(
            String resource, String identifier, String value, MessageSource messageSource) {
        this.resource = resource;
        this.identifier = identifier;
        this.value = value;
        this.messageSource = messageSource;
        this.defaultMessage =
                String.format("Could not find %s by the %s: %s", resource, identifier, value);
    }

    @Override
    public String getMessage() {
        if (messageSource == null) {
            return defaultMessage;
        }

        return messageSource.getMessage(
                MESSAGE_KEY,
                new Object[] {resource, identifier, value},
                defaultMessage,
                LocaleContextHolder.getLocale());
    }
}

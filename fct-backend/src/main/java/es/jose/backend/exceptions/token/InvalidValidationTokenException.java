package es.jose.backend.exceptions.token;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.BadRequestException;

import org.springframework.context.i18n.LocaleContextHolder;

class InvalidValidationTokenException extends BadRequestException {

    private static final String MESSAGE_KEY = "exception.invalidValidationToken";
    private static final String TOKEN_ERROR_KEY = "token.invalidValidation";

    public InvalidValidationTokenException(String details) {
        super(
                MessageSourceProvider.getMessageSource()
                        .getMessage(
                                TOKEN_ERROR_KEY,
                                null,
                                "Invalid validation token",
                                LocaleContextHolder.getLocale()),
                MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        MESSAGE_KEY,
                        null,
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

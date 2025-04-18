package es.jose.backend.exceptions.user;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.NotFoundException;

import org.springframework.context.i18n.LocaleContextHolder;

public class UserNotFoundException extends NotFoundException {

    private static final String USER_MESSAGE_KEY = "exception.userNotFound";
    private static final String RESOURCE_KEY = "resource.user";

    public UserNotFoundException(String field, String value) {
        super(
                MessageSourceProvider.getMessageSource()
                        .getMessage(RESOURCE_KEY, null, "user", LocaleContextHolder.getLocale()),
                field,
                value,
                MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        USER_MESSAGE_KEY,
                        new Object[] {
                            MessageSourceProvider.getMessageSource()
                                    .getMessage(
                                            RESOURCE_KEY,
                                            null,
                                            "user",
                                            LocaleContextHolder.getLocale()),
                            getIdentifier(),
                            getValue()
                        },
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

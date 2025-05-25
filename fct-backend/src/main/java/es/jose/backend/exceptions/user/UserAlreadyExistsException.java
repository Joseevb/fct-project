package es.jose.backend.exceptions.user;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.AlreadyExistsException;

import org.springframework.context.i18n.LocaleContextHolder;

public class UserAlreadyExistsException extends AlreadyExistsException {

    private static final String USER_MESSAGE_KEY = "exception.userAlreadyExists";
    private static final String RESOURCE_KEY = "resource.user";

    public UserAlreadyExistsException(String field) {
        super(
                MessageSourceProvider.getMessageSource()
                        .getMessage(RESOURCE_KEY, null, "user", LocaleContextHolder.getLocale()),
                field,
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
                            getIdentifier()
                        },
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

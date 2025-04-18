package es.jose.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;

@Component
public class MessageSourceProvider {

    private static MessageSource messageSource;

    @Autowired
    public MessageSourceProvider(MessageSource messageSource) {
        MessageSourceProvider.messageSource = messageSource;
    }

    public static MessageSource getMessageSource() {
        return messageSource;
    }
}

package es.jose.backend.exceptions.lineItem;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.NotFoundException;

import org.springframework.context.i18n.LocaleContextHolder;

public class LineItemNotFoundException extends NotFoundException {

    private static final String LINE_ITEM_MESSAGE_KEY = "exception.lineItemNotFound";

    public LineItemNotFoundException(String identifier, String value) {
        super("Line Item", identifier, value, MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        LINE_ITEM_MESSAGE_KEY,
                        new Object[] {"line item", getIdentifier(), getValue()},
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

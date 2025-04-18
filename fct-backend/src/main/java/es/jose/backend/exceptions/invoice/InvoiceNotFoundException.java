package es.jose.backend.exceptions.invoice;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.NotFoundException;

import org.springframework.context.i18n.LocaleContextHolder;

public class InvoiceNotFoundException extends NotFoundException {

    private static final String INVOICE_MESSAGE_KEY = "exception.invoiceNotFound";

    public InvoiceNotFoundException(String identifier, String value) {
        super("Invoice", identifier, value, MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        INVOICE_MESSAGE_KEY,
                        new Object[] {"invoice", getIdentifier(), getValue()},
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

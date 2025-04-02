package es.jose.backend.exceptions.invoice;

import es.jose.backend.exceptions.NotFoundException;

public class InvoiceNotFoundException extends NotFoundException {

    public InvoiceNotFoundException(String identifier, String value) {
        super("Invoice", identifier, value);
    }

}

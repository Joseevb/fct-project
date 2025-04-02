package es.jose.backend.exceptions.lineItem;

import es.jose.backend.exceptions.NotFoundException;

public class LineItemNotFoundException extends NotFoundException {

    public LineItemNotFoundException(String identifier, String value) {
        super("Line Item", identifier, value);
    }

}

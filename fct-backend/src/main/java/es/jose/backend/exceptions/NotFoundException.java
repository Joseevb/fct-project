package es.jose.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

    private static final String BASE_MESSAGE = "Could not find %s by the %s: %s";

    public NotFoundException(String resource, String identifier, String value) {
        super(BASE_MESSAGE.formatted(resource, identifier, value));
    }

}

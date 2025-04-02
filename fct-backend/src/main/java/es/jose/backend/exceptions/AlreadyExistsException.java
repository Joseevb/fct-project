package es.jose.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.CONFLICT)
public class AlreadyExistsException extends RuntimeException {

    private static final String BASE_MESSAGE = "%s by that %s already exists";

    public AlreadyExistsException(String resource, String identifier) {
        super(BASE_MESSAGE.formatted(resource, identifier));
    }

}

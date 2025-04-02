package es.jose.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

    private static final String BASE_MESSAGE = "Invalid request: %s";

    public BadRequestException(String message) {
        super(BASE_MESSAGE.formatted(message));
    }

}

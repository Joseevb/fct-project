package es.jose.backend.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * AuthorizationFailedException
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class AuthorizationFailedException extends AccessDeniedException {

    public AuthorizationFailedException(String msg) {
        super(msg);
    }

}

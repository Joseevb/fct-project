package es.jose.backend.exceptions.user;

import es.jose.backend.exceptions.AlredyExistsException;

public class UserAlreadyExistsException extends AlredyExistsException {

    public UserAlreadyExistsException(String field, String value) {
        super("user", field);
    }

}

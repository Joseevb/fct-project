package es.jose.backend.exceptions.user;

import es.jose.backend.exceptions.AlreadyExistsException;

public class UserAlreadyExistsException extends AlreadyExistsException {

    public UserAlreadyExistsException(String field, String value) {
        super("user", field);
    }

}

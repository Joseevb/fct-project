package es.jose.backend.exceptions.user;

import es.jose.backend.exceptions.NotFoundException;

public class UserNotFoundException extends NotFoundException {

    public UserNotFoundException(String field, String value) {
        super("user", field, value);
    }

}

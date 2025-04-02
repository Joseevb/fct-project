package es.jose.backend.exceptions.appointment;

import es.jose.backend.exceptions.AlreadyExistsException;

public class AppointmentAlreadyExistsException extends AlreadyExistsException {

    public AppointmentAlreadyExistsException(String field) {
        super("Appointment", field);
    }

}

package es.jose.backend.exceptions.appointment;

import es.jose.backend.exceptions.NotFoundException;

public class AppointmentNotFoundException extends NotFoundException {

    public AppointmentNotFoundException(String field, String value) {
        super("Appointment", field, value);
    }

}

package es.jose.backend.exceptions.appointment;

import es.jose.backend.exceptions.BadRequestException;

public class InvalidAppointmentStatusException extends BadRequestException {

    public InvalidAppointmentStatusException() {
        super("Invalid appointment status");
    }

}

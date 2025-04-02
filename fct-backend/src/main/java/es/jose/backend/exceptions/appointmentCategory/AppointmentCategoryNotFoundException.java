package es.jose.backend.exceptions.appointmentCategory;

import es.jose.backend.exceptions.NotFoundException;

public class AppointmentCategoryNotFoundException extends NotFoundException {

    public AppointmentCategoryNotFoundException(String identifier, String value) {
        super("Appointment Category", identifier, value);
    }

}

package es.jose.backend.exceptions.appointment;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.NotFoundException;

import org.springframework.context.i18n.LocaleContextHolder;

public class AppointmentNotFoundException extends NotFoundException {

    private static final String APPOINTMENT_MESSAGE_KEY = "exception.appointmentNotFound";

    public AppointmentNotFoundException(String field, String value) {
        super("Appointment", field, value, MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        APPOINTMENT_MESSAGE_KEY,
                        new Object[] {"appointment", getIdentifier(), getValue()},
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

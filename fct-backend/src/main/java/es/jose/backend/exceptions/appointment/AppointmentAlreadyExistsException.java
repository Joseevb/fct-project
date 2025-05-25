package es.jose.backend.exceptions.appointment;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.AlreadyExistsException;

import org.springframework.context.i18n.LocaleContextHolder;

public class AppointmentAlreadyExistsException extends AlreadyExistsException {

    private static final String APPOINTMENT_MESSAGE_KEY = "exception.appointmentAlreadyExists";

    public AppointmentAlreadyExistsException(String field) {
        super("Appointment", field, MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        APPOINTMENT_MESSAGE_KEY,
                        new Object[] {"appointment", getIdentifier()},
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

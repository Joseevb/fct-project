package es.jose.backend.exceptions.appointment;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.BadRequestException;

import org.springframework.context.i18n.LocaleContextHolder;

public class InvalidAppointmentStatusException extends BadRequestException {

    private static final String APPOINTMENT_MESSAGE_KEY = "exception.invalidAppointmentStatus";
    private static final String INVALID_STATUS_KEY = "appointment.invalidStatus";

    public InvalidAppointmentStatusException() {
        super(
                MessageSourceProvider.getMessageSource()
                        .getMessage(
                                INVALID_STATUS_KEY,
                                null,
                                "Invalid appointment status",
                                LocaleContextHolder.getLocale()),
                MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        APPOINTMENT_MESSAGE_KEY,
                        null,
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

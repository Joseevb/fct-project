package es.jose.backend.exceptions.appointmentCategory;

import es.jose.backend.config.MessageSourceProvider;
import es.jose.backend.exceptions.NotFoundException;

import org.springframework.context.i18n.LocaleContextHolder;

public class AppointmentCategoryNotFoundException extends NotFoundException {

    private static final String APPOINTMENT_CATEGORY_MESSAGE_KEY =
            "exception.appointmentCategoryNotFound";

    public AppointmentCategoryNotFoundException(String identifier, String value) {
        super("Appointment Category", identifier, value, MessageSourceProvider.getMessageSource());
    }

    @Override
    public String getMessage() {
        return MessageSourceProvider.getMessageSource()
                .getMessage(
                        APPOINTMENT_CATEGORY_MESSAGE_KEY,
                        new Object[] {"appointment category", getIdentifier(), getValue()},
                        super.getMessage(), // fallback to parent message
                        LocaleContextHolder.getLocale());
    }
}

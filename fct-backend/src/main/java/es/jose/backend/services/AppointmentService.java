package es.jose.backend.services;

import java.util.List;

import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.AppointmentStatusEnum;
import org.openapitools.model.UpdateAppointmentRequest;

public interface AppointmentService {

    List<Appointment> getAllAppointments();

    Appointment getAppointmentById(Long id);

    Appointment createAppointment(AddAppointmentRequest appointment);

    Appointment updateAppointment(Long id, UpdateAppointmentRequest data);

    Appointment changeAppointmentStatus(Long id, String status);

    void deleteAppointment(Long id);

}

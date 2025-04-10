package es.jose.backend.services;

import java.time.LocalDate;
import java.util.List;

import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;
import org.openapitools.model.UpdateAppointmentStatusRequest;

import es.jose.backend.persistence.entities.AppointmentEntity;

public interface AppointmentService {

    List<Appointment> getAllAppointments();

    Appointment getAppointmentById(Long id);

    AppointmentEntity getAppointmentEntityById(Long id);

    Appointment createAppointment(AddAppointmentRequest appointment);

    Appointment updateAppointment(Long id, UpdateAppointmentRequest data);

    Appointment changeAppointmentStatus(Long id, UpdateAppointmentStatusRequest data);

    List<LocalDate> getAllDaysWithAppointments();

    void deleteAppointment(Long id);

}

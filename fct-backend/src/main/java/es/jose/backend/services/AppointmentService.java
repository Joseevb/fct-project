package es.jose.backend.services;

import es.jose.backend.persistence.entities.AppointmentEntity;

import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;
import org.openapitools.model.UpdateAppointmentStatusRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing appointments. Provides methods for retrieving, creating, updating,
 * changing status, and deleting appointments.
 */
public interface AppointmentService {

    /**
     * Retrieves a list of all appointments, optionally filtered by user ID.
     *
     * @param userId Optional ID of the user whose appointments to retrieve.
     * @return a list of Appointment DTOs.
     */
    List<Appointment> getAllAppointments(Optional<Long> userId);

    /**
     * Retrieves a specific appointment by its unique identifier.
     *
     * @param id The ID of the appointment to retrieve.
     * @return the Appointment DTO corresponding to the given ID.
     */
    Appointment getAppointmentById(Long id);

    /**
     * Retrieves a specific Appointment entity by its unique identifier.
     *
     * @param id The ID of the appointment entity to retrieve.
     * @return the AppointmentEntity corresponding to the given ID.
     */
    AppointmentEntity getAppointmentEntityById(Long id);

    /**
     * Creates a new appointment based on the provided request.
     *
     * @param appointment The AddAppointmentRequest containing the details for the new appointment.
     * @return the created Appointment DTO.
     */
    Appointment createAppointment(AddAppointmentRequest appointment);

    /**
     * Updates an existing appointment identified by its unique identifier.
     *
     * @param id The ID of the appointment to update.
     * @param data The UpdateAppointmentRequest containing the updated details for the appointment.
     * @return the updated Appointment DTO.
     */
    Appointment updateAppointment(Long id, UpdateAppointmentRequest data);

    /**
     * Changes the status of an existing appointment identified by its unique identifier.
     *
     * @param id The ID of the appointment whose status to change.
     * @param data The UpdateAppointmentStatusRequest containing the new status.
     * @return the updated Appointment DTO with the new status.
     */
    Appointment changeAppointmentStatus(Long id, UpdateAppointmentStatusRequest data);

    /**
     * Retrieves a list of all distinct dates on which appointments are scheduled.
     *
     * @return a list of LocalDate representing days with appointments.
     */
    List<LocalDate> getAllDaysWithAppointments();

    /**
     * Deletes an appointment identified by its unique identifier.
     *
     * @param id The ID of the appointment to delete.
     */
    void deleteAppointment(Long id);
}

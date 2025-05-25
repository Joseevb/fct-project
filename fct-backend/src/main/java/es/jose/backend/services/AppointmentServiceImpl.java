package es.jose.backend.services;

import es.jose.backend.exceptions.appointment.AppointmentNotFoundException;
import es.jose.backend.mappers.AppointmentMapper;
import es.jose.backend.persistence.entities.AppointmentEntity;
import es.jose.backend.persistence.repositories.AppointmentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;
import org.openapitools.model.UpdateAppointmentStatusRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing appointments. Provides methods for retrieving, creating,
 * updating, changing status, and deleting appointments. Interacts with the AppointmentRepository,
 * UserService, and AppointmentCategoryService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final UserService userService;
    private final AppointmentMapper appointmentMapper;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentCategoryService appointmentCategoryService;

    /**
     * Retrieves a list of all appointments, optionally filtered by user ID.
     *
     * @param userId Optional ID of the user whose appointments to retrieve.
     * @return a list of Appointment DTOs.
     */
    @Override
    public List<Appointment> getAllAppointments(Optional<Long> userId) {
        return userId
                .map(appointmentRepository::findByUserId)
                .orElseGet(appointmentRepository::findAll)
                .stream()
                .map(appointmentMapper::toDto)
                .toList();
    }

    /**
     * Retrieves a specific appointment by its unique identifier.
     *
     * @param id The ID of the appointment to retrieve.
     * @return the Appointment DTO corresponding to the given ID.
     * @throws AppointmentNotFoundException if no appointment is found with the given ID.
     */
    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository
                .findById(id)
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    /**
     * Retrieves a specific Appointment entity by its unique identifier.
     *
     * @param id The ID of the appointment entity to retrieve.
     * @return the AppointmentEntity corresponding to the given ID.
     * @throws AppointmentNotFoundException if no appointment entity is found with the given ID.
     */
    @Override
    public AppointmentEntity getAppointmentEntityById(Long id) {
        return appointmentRepository
                .findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    /**
     * Creates a new appointment based on the provided request. Retrieves the associated user and
     * appointment category entities, calculates the price, and saves the new appointment entity.
     *
     * @param appointment The AddAppointmentRequest containing the details for the new appointment.
     * @return the created Appointment DTO.
     * @throws AppointmentNotFoundException if the user or appointment category specified in the
     *     request is not found.
     */
    @Override
    public Appointment createAppointment(AddAppointmentRequest appointment) {
        var entity = appointmentMapper.toEntity(appointment);

        var user = userService.getUserEntityById(appointment.userId());
        var category =
                appointmentCategoryService.getAppointmentCategoryEntityById(
                        appointment.categoryId());

        var durationInMinutes = BigDecimal.valueOf(appointment.duration() / 60D);
        var quotePerHour = BigDecimal.valueOf(category.getQuotePerHour());
        var price = durationInMinutes.multiply(quotePerHour);
        log.info("quotePerHour: {}", quotePerHour);
        log.info("duration: {}", appointment.duration());
        log.info("duration in minutes: {}", durationInMinutes);
        log.info("price: {}", price);

        entity.setUser(user);
        entity.setCategory(category);
        entity.setPrice(price);

        return appointmentMapper.toDto(appointmentRepository.save(entity));
    }

    /**
     * Updates an existing appointment identified by its unique identifier. Finds the existing
     * entity, updates its properties based on the request DTO, saves it, and returns the updated
     * DTO.
     *
     * @param id The ID of the appointment to update.
     * @param data The UpdateAppointmentRequest containing the updated details for the appointment.
     * @return the updated Appointment DTO.
     * @throws AppointmentNotFoundException if no appointment is found with the given ID.
     */
    @Override
    public Appointment updateAppointment(Long id, UpdateAppointmentRequest data) {
        return appointmentRepository
                .findById(id)
                .map(
                        a -> {
                            appointmentMapper.updateEntity(data, a);
                            return appointmentRepository.save(a);
                        })
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    /**
     * Changes the status of an existing appointment identified by its unique identifier. Finds the
     * existing entity, updates its status based on the request DTO, saves it, and returns the
     * updated DTO.
     *
     * @param id The ID of the appointment whose status to change.
     * @param data The UpdateAppointmentStatusRequest containing the new status.
     * @return the updated Appointment DTO with the new status.
     * @throws AppointmentNotFoundException if no appointment is found with the given ID.
     */
    @Override
    public Appointment changeAppointmentStatus(Long id, UpdateAppointmentStatusRequest data) {
        return appointmentRepository
                .findById(id)
                .map(
                        appointment -> {
                            appointment.setStatus(data.status());
                            return appointment;
                        })
                .map(appointmentRepository::save)
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    /**
     * Retrieves a list of all distinct dates on which appointments are scheduled. Fetches all
     * appointments and extracts the distinct dates.
     *
     * @return a list of LocalDate representing days with appointments.
     */
    @Override
    public List<LocalDate> getAllDaysWithAppointments() {
        return getAllAppointments(Optional.empty()).stream()
                .map(Appointment::date)
                .distinct()
                .toList();
    }

    /**
     * Deletes an appointment identified by its unique identifier.
     *
     * @param id The ID of the appointment to delete.
     * @throws AppointmentNotFoundException if no appointment is found with the given ID.
     */
    @Override
    public void deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return;
        }
        throw new AppointmentNotFoundException("id", id.toString());
    }
}

package es.jose.backend.services;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;
import org.openapitools.model.UpdateAppointmentCategoryRequest;

import java.util.List;

/**
 * Service interface for managing appointment categories. Provides methods for retrieving, creating,
 * updating, and deleting appointment categories.
 */
public interface AppointmentCategoryService {

    /**
     * Retrieves a list of all appointment categories in the system.
     *
     * @return a list of AppointmentCategory DTOs.
     */
    List<AppointmentCategory> getAllAppointmentCategories();

    /**
     * Creates a new appointment category.
     *
     * @param appointmentCategory The AddAppointmentCategoryRequest containing the details for the
     *     new category.
     * @return the created AppointmentCategory DTO.
     */
    AppointmentCategory createAppointmentCategory(
            AddAppointmentCategoryRequest appointmentCategory);

    /**
     * Retrieves a specific appointment category by its unique identifier.
     *
     * @param id The ID of the appointment category to retrieve.
     * @return the AppointmentCategory DTO corresponding to the given ID.
     */
    AppointmentCategory getAppointmentCategoryById(Long id);

    /**
     * Retrieves a specific AppointmentCategory entity by its unique identifier.
     *
     * @param id The ID of the appointment category entity to retrieve.
     * @return the AppointmentCategoryEntity corresponding to the given ID.
     */
    AppointmentCategoryEntity getAppointmentCategoryEntityById(Long id);

    /**
     * Updates an existing appointment category identified by its unique identifier.
     *
     * @param id The ID of the appointment category to update.
     * @param data The UpdateAppointmentCategoryRequest containing the updated details for the
     *     category.
     * @return the updated AppointmentCategory DTO.
     */
    AppointmentCategory updateAppointmentCategory(Long id, UpdateAppointmentCategoryRequest data);

    /**
     * Deletes an appointment category identified by its unique identifier.
     *
     * @param id The ID of the appointment category to delete.
     */
    void deleteAppointmentCategory(Long id);
}

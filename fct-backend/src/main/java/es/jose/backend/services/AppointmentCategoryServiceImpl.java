package es.jose.backend.services;

import es.jose.backend.exceptions.appointmentCategory.AppointmentCategoryNotFoundException;
import es.jose.backend.mappers.AppointmentCategoryMapper;
import es.jose.backend.persistence.entities.AppointmentCategoryEntity;
import es.jose.backend.persistence.repositories.AppointmentCategoryRepository;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;
import org.openapitools.model.UpdateAppointmentCategoryRequest;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service implementation for managing appointment categories. Provides methods for retrieving,
 * creating, updating, and deleting appointment categories and interacts with the
 * AppointmentCategoryRepository.
 */
@Service
@RequiredArgsConstructor
public class AppointmentCategoryServiceImpl implements AppointmentCategoryService {

    private final AppointmentCategoryMapper appointmentCategoryMapper;
    private final AppointmentCategoryRepository appointmentCategoryRepository;

    /**
     * Retrieves a list of all appointment categories in the system.
     *
     * @return a list of AppointmentCategory DTOs.
     */
    @Override
    public List<AppointmentCategory> getAllAppointmentCategories() {
        return appointmentCategoryRepository.findAll().stream()
                .map(appointmentCategoryMapper::toDto)
                .toList();
    }

    /**
     * Retrieves a specific appointment category by its unique identifier.
     *
     * @param id The ID of the appointment category to retrieve.
     * @return the AppointmentCategory DTO corresponding to the given ID.
     * @throws AppointmentCategoryNotFoundException if no appointment category is found with the
     *     given ID.
     */
    @Override
    public AppointmentCategory getAppointmentCategoryById(Long id) {
        return appointmentCategoryRepository
                .findById(id)
                .map(appointmentCategoryMapper::toDto)
                .orElseThrow(() -> new AppointmentCategoryNotFoundException("id", id.toString()));
    }

    /**
     * Creates a new appointment category. Maps the request DTO to an entity, saves it, and returns
     * the resulting DTO.
     *
     * @param appointmentCategory The AddAppointmentCategoryRequest containing the details for the
     *     new category.
     * @return the created AppointmentCategory DTO.
     */
    @Override
    public AppointmentCategory createAppointmentCategory(
            AddAppointmentCategoryRequest appointmentCategory) {
        var entity = appointmentCategoryMapper.toEntity(appointmentCategory);
        appointmentCategoryRepository.save(entity);
        return appointmentCategoryMapper.toDto(entity);
    }

    /**
     * Retrieves a specific AppointmentCategory entity by its unique identifier.
     *
     * @param id The ID of the appointment category entity to retrieve.
     * @return the AppointmentCategoryEntity corresponding to the given ID.
     * @throws AppointmentCategoryNotFoundException if no appointment category entity is found with
     *     the given ID.
     */
    @Override
    public AppointmentCategoryEntity getAppointmentCategoryEntityById(Long id) {
        return appointmentCategoryRepository
                .findById(id)
                .orElseThrow(() -> new AppointmentCategoryNotFoundException("id", id.toString()));
    }

    /**
     * Updates an existing appointment category identified by its unique identifier. Finds the
     * existing entity, updates its properties based on the request DTO, saves it, and returns the
     * updated DTO.
     *
     * @param id The ID of the appointment category to update.
     * @param data The UpdateAppointmentCategoryRequest containing the updated details for the
     *     category.
     * @return the updated AppointmentCategory DTO.
     * @throws AppointmentCategoryNotFoundException if no appointment category is found with the
     *     given ID.
     */
    @Override
    public AppointmentCategory updateAppointmentCategory(
            Long id, UpdateAppointmentCategoryRequest data) {
        return appointmentCategoryRepository
                .findById(id)
                .map(entity -> data.name().map(entity::setName).orElse(entity))
                .map(entity -> data.quotePerHour().map(entity::setQuotePerHour).orElse(entity))
                .map(appointmentCategoryRepository::save)
                .map(appointmentCategoryMapper::toDto)
                .orElseThrow(() -> new AppointmentCategoryNotFoundException("id", id.toString()));
    }

    /**
     * Deletes an appointment category identified by its unique identifier.
     *
     * @param id The ID of the appointment category to delete.
     * @throws AppointmentCategoryNotFoundException if no appointment category is found with the
     *     given ID.
     */
    @Override
    public void deleteAppointmentCategory(Long id) {
        if (appointmentCategoryRepository.existsById(id)) {
            appointmentCategoryRepository.deleteById(id);
            return;
        }

        throw new AppointmentCategoryNotFoundException("id", id.toString());
    }
}

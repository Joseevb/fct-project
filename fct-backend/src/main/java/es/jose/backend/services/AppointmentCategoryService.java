package es.jose.backend.services;

import java.util.List;

import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;
import org.openapitools.model.UpdateAppointmentCategoryRequest;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

public interface AppointmentCategoryService {

    List<AppointmentCategory> getAllAppointmentCategories();

    AppointmentCategory createAppointmentCategory(AddAppointmentCategoryRequest appointmentCategory);

    AppointmentCategory getAppointmentCategoryById(Long id);

    AppointmentCategoryEntity getAppointmentCategoryEntityById(Long id);

    AppointmentCategory updateAppointmentCategory(Long id, UpdateAppointmentCategoryRequest data);

    void deleteAppointmentCategory(Long id);

}

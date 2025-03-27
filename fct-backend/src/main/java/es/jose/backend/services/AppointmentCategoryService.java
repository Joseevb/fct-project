package es.jose.backend.services;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

public interface AppointmentCategoryService {

    AppointmentCategoryEntity getAppointmentCategoryById(Long id);

}

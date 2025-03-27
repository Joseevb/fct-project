package es.jose.backend.services;

import org.springframework.stereotype.Service;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;
import es.jose.backend.persistence.repositories.AppointmentCategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentCategoryServiceImpl implements AppointmentCategoryService {

    private final AppointmentCategoryRepository appointmentCategoryRepository;

    @Override
    public AppointmentCategoryEntity getAppointmentCategoryById(Long id) {
        return appointmentCategoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Appointment category not found"));

    }

}

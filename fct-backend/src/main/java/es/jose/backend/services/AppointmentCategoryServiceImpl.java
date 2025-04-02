package es.jose.backend.services;

import java.util.List;

import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;
import org.openapitools.model.UpdateAppointmentCategoryRequest;
import org.springframework.stereotype.Service;

import es.jose.backend.exceptions.appointmentCategory.AppointmentCategoryNotFoundException;
import es.jose.backend.mappers.AppointmentCategoryMapper;
import es.jose.backend.persistence.entities.AppointmentCategoryEntity;
import es.jose.backend.persistence.repositories.AppointmentCategoryRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentCategoryServiceImpl implements AppointmentCategoryService {

    private final AppointmentCategoryMapper appointmentCategoryMapper;
    private final AppointmentCategoryRepository appointmentCategoryRepository;

    @Override
    public List<AppointmentCategory> getAllAppointmentCategories() {
        return appointmentCategoryRepository.findAll()
                .stream()
                .map(appointmentCategoryMapper::toDto)
                .toList();
    }

    @Override
    public AppointmentCategory getAppointmentCategoryById(Long id) {
        return appointmentCategoryRepository.findById(id)
                .map(appointmentCategoryMapper::toDto)
                .orElseThrow(() -> new AppointmentCategoryNotFoundException("id", id.toString()));
    }

    @Override
    public AppointmentCategory createAppointmentCategory(AddAppointmentCategoryRequest appointmentCategory) {
        var entity = appointmentCategoryMapper.toEntity(appointmentCategory);
        appointmentCategoryRepository.save(entity);
        return appointmentCategoryMapper.toDto(entity);
    }

    @Override
    public AppointmentCategoryEntity getAppointmentCategoryEntityById(Long id) {
        return appointmentCategoryRepository.findById(id)
                .orElseThrow(() -> new AppointmentCategoryNotFoundException("id", id.toString()));
    }

    @Override
    public AppointmentCategory updateAppointmentCategory(Long id, UpdateAppointmentCategoryRequest data) {
        return appointmentCategoryRepository.findById(id)
                .map(entity -> {
                    entity.setName(data.name());
                    entity.setQuotePerHour(data.quotePerHour());
                    return entity;
                })
                .map(appointmentCategoryRepository::save)
                .map(appointmentCategoryMapper::toDto)
                .orElseThrow(() -> new AppointmentCategoryNotFoundException("id", id.toString()));
    }

    @Override
    public void deleteAppointmentCategory(Long id) {
        if (appointmentCategoryRepository.existsById(id)) {
            appointmentCategoryRepository.deleteById(id);
            return;
        }

        throw new AppointmentCategoryNotFoundException("id", id.toString());
    }

}

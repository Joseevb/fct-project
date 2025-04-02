package es.jose.backend.controllers;

import java.util.List;

import org.openapitools.api.AppointmentCategoryApi;
import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AppointmentCategory;
import org.openapitools.model.UpdateAppointmentCategoryRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.jose.backend.services.AppointmentCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AppointmentCategoryController implements AppointmentCategoryApi {

    private final AppointmentCategoryService service;

    @Override
    public ResponseEntity<List<AppointmentCategory>> getAllAppointmentCategories() {
        return ResponseEntity.ok(service.getAllAppointmentCategories());
    }

    @Override
    public ResponseEntity<Void> deleteAppointmentCategory(final Long id) {
        service.deleteAppointmentCategory(id);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<AppointmentCategory> getAppointmentCategoryById(final Long id) {
        return ResponseEntity.ok(service.getAppointmentCategoryById(id));
    }

    @Override
    public ResponseEntity<AppointmentCategory> updateAppointmentCategory(final Long id,
            @Valid final UpdateAppointmentCategoryRequest appointmentCategory) {
        return ResponseEntity.ok(service.updateAppointmentCategory(id, appointmentCategory));
    }

    @Override
    public ResponseEntity<AppointmentCategory> createAppointmentCategory(
            @Valid AddAppointmentCategoryRequest addAppointmentRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.createAppointmentCategory(addAppointmentRequest));
    }

}

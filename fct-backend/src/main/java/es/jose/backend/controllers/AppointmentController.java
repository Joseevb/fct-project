package es.jose.backend.controllers;

import es.jose.backend.services.AppointmentService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.AppointmentsApi;
import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.AppointmentStatusEnum;
import org.openapitools.model.UpdateAppointmentRequest;
import org.openapitools.model.UpdateAppointmentStatusRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class AppointmentController implements AppointmentsApi {

    private final AppointmentService appointmentService;

    @Override
    public ResponseEntity<List<Appointment>> getAllAppointments(
            @Valid Optional<Long> userId, @Valid Optional<AppointmentStatusEnum> status) {
        return ResponseEntity.ok(appointmentService.getAllAppointments(userId));
    }

    @Override
    public ResponseEntity<Appointment> getAppointmentById(Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @Override
    public ResponseEntity<Appointment> addAppointment(
            @Valid AddAppointmentRequest addAppointmentRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(appointmentService.createAppointment(addAppointmentRequest));
    }

    @Override
    public ResponseEntity<Void> deleteAppointment(Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Appointment> updateAppointment(
            Long id, @Valid UpdateAppointmentRequest updateAppointmentRequest) {
        return ResponseEntity.ok(
                appointmentService.updateAppointment(id, updateAppointmentRequest));
    }

    @Override
    public ResponseEntity<Appointment> updateAppointmentStatus(
            Long id, @Valid UpdateAppointmentStatusRequest updateAppointmentStatusRequest) {
        return ResponseEntity.ok(
                appointmentService.changeAppointmentStatus(id, updateAppointmentStatusRequest));
    }

    @Override
    public ResponseEntity<List<LocalDate>> getAllDaysWithAppointments() {
        return ResponseEntity.ok(appointmentService.getAllDaysWithAppointments());
    }
}

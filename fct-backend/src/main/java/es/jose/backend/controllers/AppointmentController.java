package es.jose.backend.controllers;

import java.util.List;

import org.openapitools.api.AppointmentApi;
import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.jose.backend.services.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class AppointmentController implements AppointmentApi {

    private final AppointmentService appointmentService;

    @Override
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @Override
    public ResponseEntity<Appointment> getAppointmentById(Long id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @Override
    public ResponseEntity<Appointment> addAppointment(@Valid AddAppointmentRequest addAppointmentRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(appointmentService.createAppointment(addAppointmentRequest));
    }

    @Override
    public ResponseEntity<Appointment> deleteAppointment(Long id) {
        // TODO Auto-generated method stub
        return AppointmentApi.super.deleteAppointment(id);
    }

    @Override
    public ResponseEntity<Appointment> updateAppointment(Long id,
            @Valid UpdateAppointmentRequest updateAppointmentRequest) {
        // TODO Auto-generated method stub
        return AppointmentApi.super.updateAppointment(id, updateAppointmentRequest);
    }

    @Override
    public ResponseEntity<Appointment> updateAppointmentStatus(Long id, @Valid String body) {
        return ResponseEntity.ok(appointmentService.changeAppointmentStatus(id, body));
    }

}

package es.jose.backend.services;

import java.math.BigDecimal;
import java.util.List;

import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;
import org.springframework.stereotype.Service;

import es.jose.backend.mappers.AppointmentMapper;
import es.jose.backend.persistence.repositories.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final UserService userService;
    private final AppointmentMapper appointmentMapper;
    private final AppointmentRepository appointmentRepository;
    private final AppointmentCategoryService appointmentCategoryService;

    @Override
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(appointmentMapper::toDto)
                .toList();
    }

    @Override
    public Appointment getAppointmentById(Long id) {
        return appointmentRepository.findById(id)
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));
    }

    @Override
    public Appointment createAppointment(AddAppointmentRequest appointment) {
        var entity = appointmentMapper.toEntity(appointment);

        var user = userService.getUserEntityById(appointment.userId());
        var category = appointmentCategoryService.getAppointmentCategoryById(appointment.categoryId());

        var price = category.getQuotePerHour() * appointment.duration();

        entity.setUser(user);
        entity.setCategory(category);
        entity.setPrice(BigDecimal.valueOf(price));

        return appointmentMapper.toDto(appointmentRepository.save(entity));
    }

    @Override
    public Appointment updateAppointment(Long id, UpdateAppointmentRequest data) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateAppointment'");
    }

    @Override
    public Appointment changeAppointmentStatus(Long id, String status) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'changeAppointmentStatus'");
    }

    @Override
    public void deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return;
        }
        throw new IllegalArgumentException("Appointment not found");
    }

}

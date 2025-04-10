package es.jose.backend.services;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.Appointment;
import org.openapitools.model.UpdateAppointmentRequest;
import org.openapitools.model.UpdateAppointmentStatusRequest;
import org.springframework.stereotype.Service;

import es.jose.backend.exceptions.appointment.AppointmentNotFoundException;
import es.jose.backend.mappers.AppointmentMapper;
import es.jose.backend.persistence.entities.AppointmentEntity;
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
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    @Override
    public AppointmentEntity getAppointmentEntityById(Long id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    @Override
    public Appointment createAppointment(AddAppointmentRequest appointment) {
        var entity = appointmentMapper.toEntity(appointment);

        var user = userService.getUserEntityById(appointment.userId());
        var category = appointmentCategoryService.getAppointmentCategoryEntityById(appointment.categoryId());

        var price = category.getQuotePerHour() * appointment.duration();

        entity.setUser(user);
        entity.setCategory(category);
        entity.setPrice(BigDecimal.valueOf(price));

        return appointmentMapper.toDto(appointmentRepository.save(entity));
    }

    @Override
    public Appointment updateAppointment(Long id, UpdateAppointmentRequest data) {
        return appointmentRepository.findById(id)
                .map(a -> {
                    appointmentMapper.updateEntity(data, a);
                    return appointmentRepository.save(a);
                })
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    @Override
    public Appointment changeAppointmentStatus(Long id, UpdateAppointmentStatusRequest data) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    appointment.setStatus(data.status());
                    return appointment;
                })
                .map(appointmentRepository::save)
                .map(appointmentMapper::toDto)
                .orElseThrow(() -> new AppointmentNotFoundException("id", id.toString()));
    }

    @Override
    public List<LocalDate> getAllDaysWithAppointments() {
        return getAllAppointments().stream()
                .map(Appointment::date)
                .map(OffsetDateTime::toLocalDate)
                .distinct()
                .toList();
    }

    @Override
    public void deleteAppointment(Long id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return;
        }
        throw new AppointmentNotFoundException("id", id.toString());
    }

}

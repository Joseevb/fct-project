package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.AppointmentEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {

    List<AppointmentEntity> findByUserId(Long userId);
}

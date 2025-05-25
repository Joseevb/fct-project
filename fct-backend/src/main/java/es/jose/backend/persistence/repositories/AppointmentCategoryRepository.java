package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AppointmentCategoryRepository
        extends JpaRepository<AppointmentCategoryEntity, Long> {}

package es.jose.backend.persistence.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.jose.backend.persistence.entities.AppointmentCategoryEntity;

@Repository
public interface AppointmentCategoryRepository extends JpaRepository<AppointmentCategoryEntity, Long> {

}

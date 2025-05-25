package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.CourseUserEntity;
import es.jose.backend.persistence.entities.keys.CourseUserEntityKey;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CourseUserRepository extends JpaRepository<CourseUserEntity, CourseUserEntityKey> {

    List<CourseUserEntity> findByCourse_Id(Long courseId);

    List<CourseUserEntity> findByUser_Id(Long userId);

    Optional<CourseUserEntity> findByUserIdAndCourseId(Long userId, Long courseId);
}

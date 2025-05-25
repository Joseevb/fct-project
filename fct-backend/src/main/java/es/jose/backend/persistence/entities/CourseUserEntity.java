package es.jose.backend.persistence.entities;

import es.jose.backend.persistence.entities.keys.CourseUserEntityKey;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.openapitools.model.UserCourseEnrollmentStatusEnum;

@Entity
@Table(name = "course_user")
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class CourseUserEntity {

    @EmbeddedId private CourseUserEntityKey id;

    @ManyToOne
    @MapsId("courseId")
    @JoinColumn(name = "course_id")
    private CourseEntity course;

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "status", nullable = false)
    private UserCourseEnrollmentStatusEnum status;

    public CourseUserEntity(
            CourseEntity course, UserEntity user, UserCourseEnrollmentStatusEnum status) {
        this.course = course;
        this.user = user;
        this.status = status;
        this.id = new CourseUserEntityKey(course.getId(), user.getId());
    }
}

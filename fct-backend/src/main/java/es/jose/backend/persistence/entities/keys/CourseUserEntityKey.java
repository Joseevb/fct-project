package es.jose.backend.persistence.entities.keys;

import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@Builder
@ToString
@NoArgsConstructor
@EqualsAndHashCode(of = {"userId", "courseId"})
@AllArgsConstructor
public class CourseUserEntityKey implements Serializable {
    private Long userId;
    private Long courseId;
}

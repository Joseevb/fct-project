package es.jose.backend.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.Accessors;

import java.util.Objects;

@Entity
@Table(name = "appointment_categories")
@Getter
@Setter
@ToString
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true)
    private String name;

    @Column(name = "quote_per_hour", nullable = false)
    private Double quotePerHour;

    // --- Manually Implemented equals() and hashCode() for robustness ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        // Use getClass() for proxy safety
        if (o == null || getClass() != o.getClass()) return false;
        AppointmentCategoryEntity that = (AppointmentCategoryEntity) o;
        // If ID is null, objects are only equal if they are the same instance.
        // If ID is not null, compare by ID. Handles transient vs persistent correctly.
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        // Consistent with equals. Use ID's hashcode if ID exists (persistent),
        // otherwise use a stable hashcode for transient instances of this class.
        return id != null ? Objects.hashCode(id) : getClass().hashCode();
    }
}

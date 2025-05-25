package es.jose.backend.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.openapitools.model.AppointmentStatusEnum;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
public final class AppointmentEntity implements LineItemable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @Column(name = "status", nullable = false)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private AppointmentStatusEnum status = AppointmentStatusEnum.WAITING;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "description", nullable = false, length = 500)
    private String description;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @ToString.Exclude
    private UserEntity user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    @ToString.Exclude
    private AppointmentCategoryEntity category;

    // --- Manually Implemented equals() and hashCode() for robustness ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        // Use getClass() for proxy safety
        if (o == null || getClass() != o.getClass()) return false;
        AppointmentEntity that = (AppointmentEntity) o;
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

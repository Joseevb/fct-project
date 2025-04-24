package es.jose.backend.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.stream.Stream;

@Entity
@Table(name = "line_items")
@Getter
@Setter
@Builder
@ToString(
        exclude = {
            "invoice", /* "appointment" , "product", "course" */
        })
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LineItemEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "price_at_purchase", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtPurchase;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private InvoiceEntity invoice;

    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = true)
    private AppointmentEntity appointment;

    // --- Placeholders for future relationships ---
    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = true)
    private ProductEntity product;

    //
    // @ManyToOne(optional = true, fetch = FetchType.LAZY)
    // @JoinColumn(name = "course_id", nullable = true)
    // private CourseEntity course;

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private OffsetDateTime createdAt;

    @PrePersist
    @PreUpdate
    private void validateExclusiveRelationship() {
        long count = countPresentRelationships();
        if (count == 0) {
            throw new IllegalStateException(
                    "LineItem must relate to at least one of: Appointment, Product, or Course. None"
                        + " found.");
        }
        if (count > 1) {
            throw new IllegalStateException(
                    "LineItem must relate to exactly one of: Appointment, Product, or Course. Found"
                        + " relationships: "
                            + count);
        }
    }

    @Transient
    private long countPresentRelationships() {
        // !! IMPORTANT: Update when product and course entities/fields are added !!
        return Stream.of(appointment, product /* , course */).filter(Objects::nonNull).count();
    }

    // --- Manually Implemented equals() and hashCode() for robustness ---
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        // Use getClass() for proxy safety
        if (o == null || getClass() != o.getClass()) return false;
        LineItemEntity that = (LineItemEntity) o;
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

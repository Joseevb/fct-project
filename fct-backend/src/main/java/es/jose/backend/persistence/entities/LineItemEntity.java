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
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.stream.Stream;

/**
 * Represents a line item within an invoice in the system. Each line item details a specific charge
 * or item added to an invoice, potentially linking to an Appointment, Product, or Course.
 */
@Entity
@Table(name = "line_items")
@Getter
@Setter
@Builder
@ToString(
        exclude = {"invoice", "appointment", "product", "course"})
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class LineItemEntity implements Serializable {

    /** The unique identifier for the line item. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The calculated subtotal for this line item (quantity * priceAtPurchase). */
    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;

    /** The quantity of the item or service. */
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    /** The price of the item or service at the time of purchase. */
    @Column(name = "price_at_purchase", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtPurchase;

    /** The invoice to which this line item belongs. Cannot be null. */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private InvoiceEntity invoice;

    /**
     * Optional link to an appointment related to this line item. Exactly one of appointment,
     * product, or course must be set.
     */
    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = true)
    private AppointmentEntity appointment;

    /**
     * Optional link to a product related to this line item. Exactly one of appointment, product, or
     * course must be set.
     */
    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = true)
    private ProductEntity product;

    /**
     * Optional link to a course related to this line item. Exactly one of appointment, product, or
     * course must be set.
     */
    @ManyToOne(optional = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = true)
    private CourseEntity course;

    /**
     * The timestamp when the line item was created. This field is automatically set upon
     * persistence.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * Validates that the line item is related to exactly one of: Appointment, Product, or Course.
     * This method is called before the entity is persisted or updated.
     *
     * @throws IllegalStateException if the relationship constraint is violated (none or more than
     *     one relationship set).
     */
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

    /**
     * Counts the number of non-null relationships among appointment, product, and course.
     *
     * @return the number of present relationships (0, 1, 2, or 3).
     */
    @Transient
    private long countPresentRelationships() {
        return Stream.of(appointment, product, course).filter(Objects::nonNull).count();
    }

    // --- Manually Implemented equals() and hashCode() for robustness ---

    /**
     * Indicates whether some other object is &quot;equal to&quot; this one. Equality is based on
     * the entity's unique identifier (id) if it is not null. Uses {@code getClass()} for proxy
     * safety.
     *
     * @param o the reference object with which to compare.
     * @return {@code true} if this object is the same as the obj argument; {@code false} otherwise.
     */
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

    /**
     * Returns a hash code value for the object. The hash code is consistent with the equals method,
     * using the entity's id if available.
     *
     * @return a hash code value for this object.
     */
    @Override
    public int hashCode() {
        // Consistent with equals. Use ID's hashcode if ID exists (persistent),
        // otherwise use a stable hashcode for transient instances of this class.
        return id != null ? Objects.hashCode(id) : getClass().hashCode();
    }
}

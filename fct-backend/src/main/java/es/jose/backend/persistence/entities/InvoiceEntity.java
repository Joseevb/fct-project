package es.jose.backend.persistence.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PostUpdate;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.openapitools.model.InvoiceStatusEnum;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * Represents an Invoice entity in the system. An invoice aggregates line items, details payment
 * information, status, and links to a user. It also includes auditing fields for creation and
 * update timestamps.
 */
@Entity
@Table(name = "invoices")
@Getter
@Setter
@ToString(exclude = {"lineItems", "user"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class InvoiceEntity {

    /** The unique identifier for the invoice. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The method of payment used for the invoice. */
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    /** The user associated with this invoice. Cannot be null. */
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    /** The current status of the invoice (e.g., WAITING, PAID, CANCELLED). Defaults to WAITING. */
    @Column(name = "status", nullable = false)
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private InvoiceStatusEnum status = InvoiceStatusEnum.WAITING;

    /**
     * A set of line items associated with this invoice. CascadeType.ALL ensures operations like
     * persist, merge, remove are cascaded. orphanRemoval = true removes line items when they are
     * unlinked from the invoice. FetchType.EAGER means line items are loaded eagerly with the
     * invoice. Initializes as an empty HashSet.
     */
    @Builder.Default
    @OneToMany(
            mappedBy = "invoice",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.EAGER)
    private Set<LineItemEntity> lineItems = new HashSet<>();

    /**
     * The total price of the invoice, calculated as the sum of subtotals of all line items.
     * Defaults to BigDecimal.ZERO.
     */
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal totalPrice = BigDecimal.ZERO;

    /**
     * Updates the total price of the invoice based on the sum of subtotals of its line items. This
     * method is called before the entity is persisted and after it is updated. If the line items
     * set is null or empty, totalPrice is set to BigDecimal.ZERO.
     */
    @PrePersist
    @PostUpdate
    public void updateTotalPrice() {
        this.totalPrice =
                (this.lineItems == null || this.lineItems.isEmpty())
                        ? BigDecimal.ZERO
                        : this.lineItems.stream()
                                .map(LineItemEntity::getSubtotal)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    // --- Auditing Fields managed by Spring Data JPA ---

    /**
     * The timestamp when the invoice was created. This field is automatically set upon persistence.
     */
    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    /**
     * The timestamp when the invoice was last updated. This field is automatically updated upon
     * modification.
     */
    @Column(name = "updated_at", nullable = true)
    @LastModifiedDate
    private LocalDateTime updatedAt;

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
        InvoiceEntity that = (InvoiceEntity) o;
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

package es.jose.backend.persistence.entities;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.Objects;

import org.openapitools.model.InvoiceStatusEnum;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@ToString
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class InvoiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(name = "notes", nullable = false, length = 500)
    private String notes;

    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserEntity user;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InvoiceStatusEnum status;

    // --- Auditing Fields managed by Spring Data JPA ---

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = true)
    private OffsetDateTime updatedAt;

    // --- Manually Implemented equals() and hashCode() for robustness ---
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        // Use getClass() for proxy safety
        if (o == null || getClass() != o.getClass())
            return false;
        InvoiceEntity that = (InvoiceEntity) o;
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

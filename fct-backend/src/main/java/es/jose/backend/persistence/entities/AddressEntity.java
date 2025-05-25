package es.jose.backend.persistence.entities;

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
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.openapitools.model.AddressTypeEnum;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "addresses")
@Getter
@Setter
@Builder
@ToString
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
public class AddressEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Street cannot be blank")
    @Size(max = 255, message = "Street must not exceed 255 characters")
    @Column(name = "street", nullable = false, length = 255)
    private String street;

    @NotBlank(message = "City cannot be blank")
    @Size(max = 100, message = "City must not exceed 100 characters")
    @Column(name = "city", nullable = false, length = 100)
    private String city;

    @NotBlank(message = "State cannot be blank")
    @Size(max = 100, message = "State must not exceed 100 characters")
    @Column(name = "state", nullable = false, length = 100)
    private String state;

    @NotBlank(message = "Zip code cannot be blank")
    @Size(max = 20, message = "Zip code must not exceed 20 characters")
    @Column(name = "zip_code", nullable = false, length = 20)
    private String zipCode;

    @NotBlank(message = "Country cannot be blank")
    @Size(max = 100, message = "Country must not exceed 100 characters")
    @Column(name = "country", nullable = false, length = 100)
    private String country;

    @NotNull(message = "Address type cannot be null")
    @Column(name = "address_type", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private AddressTypeEnum addressType;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    @ToString.Exclude
    private UserEntity user;

    // --- Auditing Fields managed by Spring Data JPA ---

    @Column(name = "created_at", nullable = false, updatable = false)
    @CreatedDate
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = true)
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // --- Manual equals() and hashCode() implementation for JPA entities ---

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        // Use getClass() comparison for JPA proxy safety
        if (o == null || getClass() != o.getClass())
            return false;
        AddressEntity that = (AddressEntity) o;
        // If ID is null (transient state), objects are only equal if they are the same
        // instance.
        // If ID is not null (persistent state), compare by ID.
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        // Consistent with equals.
        // Use ID's hashcode if ID exists (persistent),
        // otherwise use a stable hashcode for all transient instances of this class.
        // getClass().hashCode() ensures proxy safety and stability for transient
        // instances.
        return id != null ? Objects.hashCode(id) : getClass().hashCode();
    }
}

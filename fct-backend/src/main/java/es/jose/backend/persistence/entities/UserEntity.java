package es.jose.backend.persistence.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import org.openapitools.model.RoleEnum;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@Builder
@ToString(exclude = {"password", "userCourses"})
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email should be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @NotBlank(message = "Username cannot be blank")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    /**
     * IMPORTANT: This field stores the HASHED password, not the plaintext password. Validation
     * (@NotBlank, length checks) should apply primarily to the user INPUT (in DTO), but the stored
     * hash should also not be blank.
     */
    @NotBlank(message = "Password hash cannot be blank")
    @Column(name = "password", nullable = false, length = 70)
    private String password;

    @NotBlank(message = "First name cannot be blank")
    @Size(max = 50, message = "First name must not exceed 50 characters")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Last name cannot be blank")
    @Size(max = 50, message = "Last name must not exceed 50 characters")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotNull(message = "Role cannot be null")
    @Column(name = "role", nullable = false, length = 20)
    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = false;

    @Builder.Default
    @OneToMany(mappedBy = "user")
    private Set<CourseUserEntity> userCourses = new HashSet<>();

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
        if (this == o) return true;
        // Use getClass() comparison for JPA proxy safety
        if (o == null || getClass() != o.getClass()) return false;
        UserEntity that = (UserEntity) o;
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

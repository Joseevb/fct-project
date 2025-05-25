package es.jose.backend.persistence.entities;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Table(name = "courses")
@Entity
@Getter
@Setter
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
public final class CourseEntity implements LineItemable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "enrollment_price", nullable = false)
    private Double enrollmentPrice;

    @JoinColumn(name = "category_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private CourseCategoryEntity category;

    @Column(name = "description", nullable = false, length = 5000)
    private String description;

    @Column(name = "image_filename", nullable = false)
    @Builder.Default
    @CollectionTable(name = "course_image_names", joinColumns = @JoinColumn(name = "course_id"))
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> imgNames = new ArrayList<>();

    @OneToMany(mappedBy = "course")
    @Builder.Default
    private Set<CourseUserEntity> courseUsers = new HashSet<>();
}

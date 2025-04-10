package es.jose.backend;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.AppointmentStatusEnum;
import org.openapitools.model.RoleEnum;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;

import es.jose.backend.config.RsaKeyConfigProperties;
import es.jose.backend.persistence.entities.AppointmentCategoryEntity;
import es.jose.backend.persistence.entities.AppointmentEntity;
import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.repositories.AppointmentCategoryRepository;
import es.jose.backend.persistence.repositories.AppointmentRepository;
import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.services.InvoiceService;

@SpringBootApplication
@EnableConfigurationProperties(RsaKeyConfigProperties.class)
public class FctBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FctBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner runner(UserRepository userRepository, AppointmentRepository appointmentRepository,
            AppointmentCategoryRepository categoryRepository, InvoiceService invoiceService) {
        return args -> {
            var users = List.of(
                    UserEntity.builder()
                            .username("admin")
                            .password("{noop}admin")
                            .role(RoleEnum.ADMIN)
                            .email("admin@admin.com")
                            .firstName("admin")
                            .lastName("admin")
                            .isActive(true)
                            .build(),
                    UserEntity.builder()
                            .username("user")
                            .password("{noop}user")
                            .role(RoleEnum.USER)
                            .email("user@user.com")
                            .firstName("user")
                            .lastName("user")
                            .isActive(true)
                            .build());
            userRepository.saveAll(users);

            var appointmentCategories = List.of(
                    AppointmentCategoryEntity.builder()
                            .name("Category name 1")
                            .quotePerHour(1D)
                            .build(),
                    AppointmentCategoryEntity.builder()
                            .name("Category name 2")
                            .quotePerHour(2D)
                            .build(),
                    AppointmentCategoryEntity.builder()
                            .name("Category name 3")
                            .quotePerHour(3D)
                            .build(),
                    AppointmentCategoryEntity.builder()
                            .name("Category name 4")
                            .quotePerHour(4D)
                            .build(),
                    AppointmentCategoryEntity.builder()
                            .name("Category name 5")
                            .quotePerHour(5D)
                            .build());

            appointmentCategories = categoryRepository.saveAll(appointmentCategories);

            var appointments = List.of(
                    AppointmentEntity.builder()
                            .date(OffsetDateTime.now().plusDays(5))
                            .duration(1)
                            .status(AppointmentStatusEnum.WAITING)
                            .description("Appointment description")
                            .price(BigDecimal.valueOf(1))
                            .user(users.getFirst())
                            .category(appointmentCategories.getFirst())
                            .build());

            appointmentRepository.saveAll(appointments);

            invoiceService.createInvoice(AddInvoiceRequest.builder()
                    .notes("").userId(1L)
                    .paymentMethod("")
                    .build());
        };
    }

}

package es.jose.backend.config;

import es.jose.backend.persistence.repositories.CourseRepository;
import es.jose.backend.persistence.repositories.ProductRepository;
import es.jose.backend.services.AppointmentCategoryService;
import es.jose.backend.services.AppointmentService;
import es.jose.backend.services.CourseCategoryService;
import es.jose.backend.services.CourseService;
import es.jose.backend.services.InvoiceService;
import es.jose.backend.services.ProductCategoryService;
import es.jose.backend.services.ProductService;
import es.jose.backend.services.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.AddAppointmentCategoryRequest;
import org.openapitools.model.AddAppointmentRequest;
import org.openapitools.model.AddCourseCategoryRequest;
import org.openapitools.model.AddCourseRequest;
import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.AddProductCategoryRequest;
import org.openapitools.model.AddProductRequest;
import org.openapitools.model.AddUserRequest;
import org.openapitools.model.RoleEnum;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.ApplicationContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.AbstractMap;
import java.util.List;
import java.util.Random;
import java.util.stream.IntStream;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ApplicationContext ctx;
    private final UserService userService;
    private final AppointmentService appointmentService;
    private final AppointmentCategoryService appointmentCategoryService;
    private final InvoiceService invoiceService;
    private final CourseService courseService;
    private final CourseRepository courseRepository;
    private final CourseCategoryService courseCategoryService;
    private final ProductCategoryService productCategoryService;
    private final ProductService productService;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (isDatabaseEmpty()) {
            populateTestData();
        }
    }

    /**
     * Checks if the database is empty.
     *
     * @return true if the database is empty, false otherwise.
     */
    private boolean isDatabaseEmpty() {
        // This check still relies on repositories, which is fine as the request was about
        // initialization.
        return ctx.getBeansOfType(JpaRepository.class).values().stream()
                        .mapToLong(JpaRepository::count)
                        .sum()
                == 0;
    }

    /**
     * Populates the database with test data.<br>
     * Only executed if the database is empty.
     */
    private void populateTestData() {
        // Initialize users using the service
        var users =
                List.of(
                                AddUserRequest.builder()
                                        .username("admin")
                                        .password("admin")
                                        .role(RoleEnum.ADMIN)
                                        .email("admin@admin.com")
                                        .firstName("admin")
                                        .lastName("admin")
                                        .build(),
                                AddUserRequest.builder()
                                        .username("user")
                                        .password("user")
                                        .role(RoleEnum.USER)
                                        .email("user@user.com")
                                        .firstName("user")
                                        .lastName("user")
                                        .build())
                        .stream()
                        .map(userService::createUser)
                        .map(u -> userService.activateUserById(u.id()))
                        .toList();

        var appointmentCategories =
                List.of(
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje de Novia")
                                        .quotePerHour(100D)
                                        .build(),
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje sencillo - 1 persona")
                                        .quotePerHour(60D)
                                        .build(),
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje sencillo - 2 personas")
                                        .quotePerHour(90D)
                                        .build(),
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje sencillo - 3 o mas personas")
                                        .quotePerHour(140D)
                                        .build(),
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje Avanzado - 1 persona")
                                        .quotePerHour(200D)
                                        .build(),
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje Avanzado - 2 persona")
                                        .quotePerHour(290D)
                                        .build(),
                                AddAppointmentCategoryRequest.builder()
                                        .name("Maquillaje Avanzado - 3 personas")
                                        .quotePerHour(380D)
                                        .build())
                        .stream()
                        .map(appointmentCategoryService::createAppointmentCategory)
                        .toList();

        List.of(
                        AddAppointmentRequest.builder()
                                .date(LocalDate.now().plusDays(5))
                                .duration(30)
                                .description("Maquillaje sencillo para la fiesta de una amiga")
                                .userId(getRandomElement(users).id())
                                .categoryId(getRandomElement(appointmentCategories).id())
                                .build(),
                        AddAppointmentRequest.builder()
                                .date(LocalDate.now().plusDays(7))
                                .duration(60)
                                .description("Cita de maquillaje de novia")
                                .userId(getRandomElement(users).id())
                                .categoryId(getRandomElement(appointmentCategories).id())
                                .build())
                .stream()
                .map(appointmentService::createAppointment)
                .toList();

        invoiceService.createInvoice(
                AddInvoiceRequest.builder()
                        .userId(users.getFirst().id())
                        .paymentMethod("")
                        .build());

        var courseCategories =
                List.of(
                                AddCourseCategoryRequest.builder()
                                        .name("Automaquillaje Básico")
                                        .build(),
                                AddCourseCategoryRequest.builder()
                                        .name("Automaquillaje Medio")
                                        .build(),
                                AddCourseCategoryRequest.builder()
                                        .name("Automaquillaje Avanzado")
                                        .build(),
                                AddCourseCategoryRequest.builder()
                                        .name("Maquillaje Profesional Medio")
                                        .build(),
                                AddCourseCategoryRequest.builder()
                                        .name("Maquillaje Profesional Avanzado")
                                        .build())
                        .stream()
                        .map(courseCategoryService::addCourseCategory)
                        .toList();

        List.of(
                        AddCourseRequest.builder()
                                .startDate(LocalDate.now())
                                .endDate(LocalDate.now().plusWeeks(5))
                                .description(
"""
<p>En este curso introductorio aprenderás los fundamentos esenciales del maquillaje para realzar la belleza natural de cada piel, desde la preparación y cuidado del rostro hasta la correcta aplicación de productos básicos.</p>
<ul>
  <li>Conocerás la rutina de limpieza e hidratación previa al maquillaje.</li>
  <li>Identificarás tu tipo de piel y elegirás las texturas y tonos adecuados.</li>
  <li>Dominarás la aplicación de base, correctores y polvos para un acabado uniforme.</li>
  <li>Aprenderás técnicas básicas de diseño y perfilado de cejas.</li>
  <li>Practicarás el difuminado de sombras en tonos neutros.</li>
  <li>Utilizarás pinceles y esponjas profesionales para cada fase del maquillaje.</li>
  <li>Recibirás un kit básico de herramientas y un manual paso a paso.</li>
  <li>Duración: 20 horas teórico-prácticas con certificado de asistencia.</li>
</ul>
""")
                                .enrollmentPrice(50d)
                                .categoryId(getRandomElement(courseCategories).id())
                                .build(),
                        AddCourseRequest.builder()
                                .startDate(LocalDate.now().plusWeeks(6))
                                .endDate(LocalDate.now().plusWeeks(6).plusWeeks(5))
                                .enrollmentPrice(50d)
                                .description(
"""
<p>Este curso está diseñado para quienes ya poseen conocimientos básicos de maquillaje y desean perfeccionar sus habilidades, explorando técnicas avanzadas que les permitan destacarse en el ámbito profesional.</p>
<ul>
  <li>Perfeccionamiento de la piel: aplicación de técnicas para lograr diferentes acabados y texturas.</li>
  <li>Elección adecuada de tonos, texturas y coberturas según el tipo de piel y ocasión.</li>
  <li>Dominio del contouring para crear volúmenes y dimensiones en el rostro.</li>
  <li>Uso de iluminadores con distintos acabados para resaltar facciones.</li>
  <li>Perfeccionamiento de delineados utilizando lápiz, sombras y eyeliner.</li>
  <li>Estudio y corrección de las facciones: frente, nariz, mentón y cuello.</li>
  <li>Adaptación del maquillaje al cliente, considerando sus características y necesidades.</li>
  <li>Exploración de estilos de maquillaje: día, noche, pasarela, nupcial y fantasía.</li>
  <li>Duración: 30 horas, combinando teoría y práctica intensiva.</li>
</ul>
""")
                                .categoryId(getRandomElement(courseCategories).id())
                                .build(),
                        AddCourseRequest.builder()
                                .startDate(LocalDate.now().plusWeeks(12))
                                .endDate(LocalDate.now().plusWeeks(12).plusWeeks(5))
                                .enrollmentPrice(150d)
                                .description(
"""

<p>Este curso está diseñado para profesionales del maquillaje que deseen especializarse en el maquillaje nupcial, ofreciendo un servicio personalizado y de alta calidad para novias y sus acompañantes en el día de la boda.</p> <ul> <li>Aprenderás a realizar maquillajes para novias, novios, madrinas y damas de honor, adaptando cada estilo a las características individuales y al protocolo de la ceremonia.</li> <li>Dominarás técnicas avanzadas de visagismo y corrección facial para resaltar la belleza natural de cada cliente.</li> <li>Conocerás los diferentes estilos de maquillaje nupcial, incluyendo clásico, neutro, de pasarela y adaptaciones según la temporada.</li> <li>Estudiarás el protocolo de boda y el estilismo adecuado para cada protagonista del evento.</li> <li>Aprenderás sobre tratamientos de la piel previos al maquillaje para garantizar un acabado impecable y duradero.</li> <li>El curso se imparte en modalidad online, con una duración de 4 meses y un total de 36 horas de formación.</li> <li>Al finalizar, recibirás una titulación homologada que certifica tus competencias en maquillaje nupcial.</li> </ul>
""")
                                .categoryId(getRandomElement(courseCategories).id())
                                .build())
                .stream()
                .map(courseService::createCourse)
                .toList();

        final String[] courseImageNames = {"course1.png", "course2.png", "course3.png"};

        IntStream.range(0, courseImageNames.length)
                .mapToObj(i -> new AbstractMap.SimpleEntry<>(i, courseRepository.findAll().get(i)))
                .forEachOrdered(
                        entry -> {
                            var entity = entry.getValue();
                            log.info("Course {}", entry.getKey());
                            entity.getImgNames().add(courseImageNames[entry.getKey()]);
                            courseRepository.save(entity);
                        });

        // Product categories and products are already using services

        var cara =
                productCategoryService.createProductCategory(
                        AddProductCategoryRequest.builder()
                                .name("Cara")
                                .vatPercentage(0.21D)
                                .build());
        var ojos =
                productCategoryService.createProductCategory(
                        AddProductCategoryRequest.builder()
                                .name("Ojos")
                                .vatPercentage(0.21D)
                                .build());
        var cejas =
                productCategoryService.createProductCategory(
                        AddProductCategoryRequest.builder()
                                .name("Cejas")
                                .vatPercentage(0.21D)
                                .build());
        var labios =
                productCategoryService.createProductCategory(
                        AddProductCategoryRequest.builder()
                                .name("Labios")
                                .vatPercentage(0.21D)
                                .build());

        List.of(
                        AddProductRequest.builder()
                                .name("Lash Idole Midi")
                                .description("Máscara de pestañas larga duración")
                                .price(18d)
                                .productCategoryId(ojos.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Uklash Eyelash Serum Pestañas")
                                .description("Tratamiento para pestañas")
                                .price(39d)
                                .productCategoryId(ojos.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Eyelash Curler")
                                .description("Rizador de pestañas")
                                .price(33.50d)
                                .productCategoryId(ojos.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Almost Lipstick - Black Honey")
                                .description("Brillo de Labios")
                                .price(31d)
                                .productCategoryId(labios.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Clinique Pop Lip & Cheek Oil")
                                .description("Multitask labios y mejillas. ")
                                .price(31.50d)
                                .productCategoryId(labios.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Labial Almost Lipstick Pink Honey")
                                .description("Barra de labios")
                                .price(31d)
                                .productCategoryId(labios.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Estuche Lisse Minute")
                                .description("Prebase de maquillaje hidratante")
                                .price(36d)
                                .productCategoryId(cara.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("All Nighter Setting Spray Travel Size")
                                .description("Spray fijador de maquillaje tamaño viaje ")
                                .price(21d)
                                .productCategoryId(cara.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Chubby Stick Sculpting Curvy Contour")
                                .description("Contorno en barra")
                                .price(37d)
                                .productCategoryId(cara.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Ukbrow Eyebrow Serum Cejas")
                                .description("Tratamiento Cejas")
                                .price(39d)
                                .productCategoryId(cejas.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Limpiador De Cejas Y Pestañas Uklash")
                                .description("Limpiador cejas y pestañas")
                                .price(20d)
                                .productCategoryId(cejas.id())
                                .stock((int) Math.random() * 100)
                                .build(),
                        AddProductRequest.builder()
                                .name("Brow Blade 2 En 1")
                                .description("Lápiz de Cejas ")
                                .price(35d)
                                .productCategoryId(cejas.id())
                                .stock((int) Math.random() * 100)
                                .build())
                .stream()
                .map(productService::createProduct)
                .toList();

        final String[] productImageNames = {
            "product1.webp",
            "product2.webp",
            "product3.webp",
            "product4.webp",
            "product5.webp",
            "product6.webp",
            "product7.webp",
            "product8.webp",
            "product9.webp",
            "product10.webp",
            "product11.webp",
            "product12.webp"
        };

        IntStream.range(0, productImageNames.length)
                .mapToObj(i -> new AbstractMap.SimpleEntry<>(i, productRepository.findAll().get(i)))
                .forEachOrdered(
                        entry -> {
                            var entity = entry.getValue();
                            log.info("Course {}", entry.getKey());
                            entity.setImageName(productImageNames[entry.getKey()]);
                            productRepository.save(entity);
                        });
    }

    /**
     * Returns a random element from the given list.
     *
     * @param list The list to get a random element from.
     * @param <T> The type of elements in the list.
     * @return A random element from the list, or null if the list is empty.
     */
    private <T> T getRandomElement(List<T> list) {
        final Random RANDOM = new Random();
        // Handle the case where the list is empty
        if (list == null || list.isEmpty()) {
            return null; // Or throw an exception, depending on desired behavior
        }

        // Get the size of the list
        int size = list.size();

        // Generate a random integer between 0 (inclusive) and size (exclusive)
        int randomIndex = RANDOM.nextInt(size);

        // Return the element at the random index
        return list.get(randomIndex);
    }
}

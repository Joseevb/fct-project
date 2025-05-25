package es.jose.backend.services;

import es.jose.backend.exceptions.lineItem.LineItemNotFoundException;
import es.jose.backend.mappers.LineItemMapper;
import es.jose.backend.persistence.entities.AppointmentEntity;
import es.jose.backend.persistence.entities.CourseEntity;
import es.jose.backend.persistence.entities.LineItemEntity;
import es.jose.backend.persistence.entities.LineItemable;
import es.jose.backend.persistence.entities.ProductEntity;
import es.jose.backend.persistence.repositories.InvoiceRepository;
import es.jose.backend.persistence.repositories.LineItemRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.AddLineItemRequest;
import org.openapitools.model.LineItem;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Service implementation for managing LineItem entities. Provides operations for retrieving,
 * creating, and deleting line items. Handles the logic for linking line items to Appointments,
 * Products, or Courses and updating the associated Invoice's total price.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LineItemServiceImpl implements LineItemService {

    private final CourseService courseService;
    private final LineItemMapper lineItemMapper;
    private final InvoiceService invoiceService;
    private final ProductService productService;
    private final InvoiceRepository invoiceRepository;
    private final LineItemRepository lineItemRepository;
    private final AppointmentService appointmentService;

    /**
     * Retrieves all existing line items. Optionally, filters by invoice ID.
     *
     * @param invoiceId the ID of the invoice to filter by.
     * @return a list of all LineItem DTOs.
     */
    @Override
    public List<LineItem> getAllLineItems(Optional<Long> invoiceId) {
        return invoiceId
                .map(lineItemRepository::findAllByInvoiceId)
                .orElseGet(lineItemRepository::findAll)
                .stream()
                .map(lineItemMapper::toDto)
                .toList();
    }

    /**
     * Retrieves a specific line item by its ID.
     *
     * @param id the ID of the line item to retrieve.
     * @return the LineItem DTO corresponding to the given ID.
     * @throws LineItemNotFoundException if no line item is found with the given ID.
     */
    @Override
    public LineItem getLineItemById(Long id) {
        return lineItemRepository
                .findById(id)
                .map(lineItemMapper::toDto)
                .orElseThrow(() -> new LineItemNotFoundException("id", id.toString()));
    }

    /**
     * Creates a new line item based on the provided request. Links the line item to the specified
     * invoice and the related object (Appointment, Product, or Course). Calculates the subtotal and
     * updates the associated invoice's total price.
     *
     * @param lineItem the request object containing details for the new line item.
     * @return the created LineItem DTO.
     */
    @Override
    public LineItem createLineItem(final AddLineItemRequest lineItem) {
        final var invoice = invoiceService.getInvoiceEntityById(lineItem.invoiceId());
        final var lineItemObject = getLineItemObject(lineItem);

        LineItemEntity entity = lineItemMapper.toEntity(lineItem);
        entity.setInvoice(invoice);

        setLineItemObject(entity, lineItemObject);
        setLineItemSubtotal(entity, lineItemObject);

        entity = lineItemRepository.save(entity);

        updateInvoice(entity);

        return lineItemMapper.toDto(entity);
    }

    /**
     * Determines the related object (AppointmentEntity, ProductEntity, or CourseEntity) based on
     * the presence of their respective IDs in the AddLineItemRequest.
     *
     * @param lineItem the request object containing potential IDs.
     * @return the LineItemable object (AppointmentEntity, ProductEntity, CourseEntity), or null if
     *     none is specified.
     */
    private LineItemable getLineItemObject(final AddLineItemRequest lineItem) {
        return Stream.of(
                        lineItem.appointmentId().map(appointmentService::getAppointmentEntityById),
                        lineItem.productId().map(productService::getProductEntityById),
                        lineItem.courseId().map(courseService::getCourseEntityById))
                .filter(Optional::isPresent)
                .map(Optional::get)
                .findFirst()
                .orElse(null);
    }

    /**
     * Sets the appropriate relationship field (appointment, product, or course) in the
     * LineItemEntity based on the type of the provided LineItemable object.
     *
     * @param entity the LineItemEntity to update.
     * @param object the LineItemable object to link.
     * @return the updated LineItemEntity.
     */
    private LineItemEntity setLineItemObject(
            final LineItemEntity entity, final LineItemable object) {
        return switch (object) {
            case AppointmentEntity appointment -> {
                entity.setAppointment(appointment);
                yield entity;
            }
            case ProductEntity product -> {
                entity.setProduct(product);
                yield entity;
            }
            case CourseEntity course -> {
                entity.setCourse(course);
                yield entity;
            }
            default -> null;
        };
    }

    /**
     * Calculates and sets the subtotal and priceAtPurchase for the LineItemEntity based on the type
     * and price of the linked object (Appointment, Product, or Course). Includes VAT calculation
     * for products.
     *
     * @param entity the LineItemEntity to update.
     * @param object the linked object (AppointmentEntity, ProductEntity, CourseEntity).
     * @return the updated LineItemEntity.
     */
    private LineItemEntity setLineItemSubtotal(final LineItemEntity entity, final Object object) {
        return switch (object) {
            case AppointmentEntity appointment -> {
                log.info("Adding appointment: {}", appointment);
                entity.setSubtotal(appointment.getPrice());
                entity.setPriceAtPurchase(appointment.getPrice());
                yield entity;
            }
            case CourseEntity course -> {
                log.info("Adding course: {}", course);
                entity.setSubtotal(BigDecimal.valueOf(course.getEnrollmentPrice()));
                entity.setPriceAtPurchase(BigDecimal.valueOf(course.getEnrollmentPrice()));
                yield entity;
            }
            case ProductEntity product -> {
                log.info("Adding product: {}", product);

                var tax = product.getProductCategory().getVatPercentage() * product.getPrice();

                entity.setSubtotal(
                        BigDecimal.valueOf((product.getPrice() + tax) * entity.getQuantity()));
                entity.setPriceAtPurchase(BigDecimal.valueOf(product.getPrice()));
                yield entity;
            }
            default -> null;
        };
    }

    /**
     * Updates the associated invoice's total price by adding the new line item's subtotal. Also
     * updates the invoice's `updatedAt` timestamp and saves the invoice.
     *
     * @param entity the newly created or updated LineItemEntity.
     */
    private void updateInvoice(LineItemEntity entity) {
        final var invoice = entity.getInvoice();
        invoice.setUpdatedAt(LocalDateTime.now());
        invoice.setTotalPrice(invoice.getTotalPrice().add(entity.getSubtotal()));
        invoiceRepository.save(invoice);
    }

    /**
     * Deletes a line item by its ID.
     *
     * @param lineItemId the ID of the line item to delete.
     * @throws LineItemNotFoundException if no line item is found with the given ID.
     */
    @Override
    public void deleteLineItem(Long lineItemId) {
        if (lineItemRepository.findById(lineItemId).isPresent()) {
            lineItemRepository.deleteById(lineItemId);
        }

        throw new LineItemNotFoundException("id", lineItemId.toString());
    }
}

package es.jose.backend.services;

import es.jose.backend.exceptions.invoice.InvoiceNotFoundException;
import es.jose.backend.mappers.InvoiceMapper;
import es.jose.backend.persistence.entities.InvoiceEntity;
import es.jose.backend.persistence.entities.LineItemEntity;
import es.jose.backend.persistence.repositories.InvoiceRepository;
import es.jose.backend.utils.ThymeleafUtils;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceRequest;
import org.openapitools.model.UpdateInvoiceStatusRequest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Service implementation for managing invoices. Provides methods for retrieving, creating,
 * updating, changing status, and deleting invoices, as well as generating PDF representations.
 * Interacts with the InvoiceRepository, UserService, and ThymeleafUtils.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final UserService userService;
    private final InvoiceMapper invoiceMapper;
    private final InvoiceRepository invoiceRepository;
    private final ThymeleafUtils thymeleafUtils;

    /**
     * Retrieves a list of all invoices, optionally filtered by user ID, status, or associated line
     * item ID.
     *
     * @param userId Optional ID of the user whose invoices to retrieve.
     * @param status Optional status of the invoices to retrieve.
     * @param lineItemableId Optional ID of a line itemable entity (Appointment, Product, Course) to
     *     filter invoices by (invoices containing a line item linked to this entity).
     * @return a list of Invoice DTOs.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices(
            Optional<Long> userId,
            Optional<InvoiceStatusEnum> status,
            Optional<Long> lineItemableId) {
        Specification<InvoiceEntity> spec =
                (root, query, cb) -> {
                    var predicates = new ArrayList<>();

                    userId.ifPresent(
                            id -> predicates.add(cb.equal(root.get("user").get("id"), id)));
                    status.ifPresent(st -> predicates.add(cb.equal(root.get("status"), st)));

                    lineItemableId.ifPresent(
                            id -> {
                                // Join with lineItems
                                Join<InvoiceEntity, LineItemEntity> lineItemJoin =
                                        root.join("lineItems", JoinType.INNER);

                                // Create a disjunction (OR) for the different possible relations
                                Predicate appointmentPredicate =
                                        cb.equal(lineItemJoin.get("appointment").get("id"), id);
                                // Predicate productPredicate =
                                //         cb.equal(lineItemJoin.get("product").get("id"), id);
                                // Uncomment when course is implemented
                                // Predicate coursePredicate =
                                // cb.equal(lineItemJoin.get("course").get("id"), id);

                                // Add the OR condition to the predicates list
                                predicates.add(cb.or(appointmentPredicate /*,
                                                productPredicate, coursePredicate*/));
                            });

                    return cb.and(predicates.toArray(new Predicate[0]));
                };

        return invoiceRepository.findAll(spec).stream().map(invoiceMapper::toDto).toList();
    }

    /**
     * Retrieves a list of all paid invoices.
     *
     * @return a list of Invoice DTOs with the status PAID.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Invoice> getAllPaidInvoices() {
        Specification<InvoiceEntity> spec =
                (root, query, cb) -> {
                    var predicates = List.of(cb.equal(root.get("status"), InvoiceStatusEnum.PAID));

                    return cb.and(predicates.toArray(new Predicate[0]));
                };
        return invoiceRepository.findAll(spec).stream().map(invoiceMapper::toDto).toList();
    }

    /**
     * Retrieves a specific invoice by its unique identifier.
     *
     * @param id The ID of the invoice to retrieve.
     * @return the Invoice DTO corresponding to the given ID.
     * @throws InvoiceNotFoundException if no invoice is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository
                .findById(id)
                .map(invoiceMapper::toDto)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    /**
     * Retrieves a specific invoice by its unique identifier and returns it as a PDF Resource.
     *
     * @param id The ID of the invoice to retrieve.
     * @return the invoice as a PDF Resource.
     * @throws InvoiceNotFoundException if no invoice is found with the given ID.
     * @throws RuntimeException if there is an error generating the PDF.
     */
    @Override
    @Transactional(readOnly = true)
    public Resource getInvoiceByIdAsPDF(Long id) {
        return invoiceRepository
                .findById(id)
                .map(thymeleafUtils::parseThymeleafTemplateAsPDF)
                .map(ByteArrayResource::new)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    /**
     * Retrieves a specific Invoice entity by its unique identifier.
     *
     * @param id The ID of the invoice entity to retrieve.
     * @return the InvoiceEntity corresponding to the given ID.
     * @throws InvoiceNotFoundException if no invoice entity is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public InvoiceEntity getInvoiceEntityById(Long id) {
        return invoiceRepository
                .findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    /**
     * Creates a new invoice based on the provided request. Retrieves the associated user entity and
     * sets it in the invoice entity before saving.
     *
     * @param invoice The AddInvoiceRequest containing the details for the new invoice.
     * @return the created Invoice DTO.
     * @throws InvoiceNotFoundException if the user specified in the request is not found.
     */
    @Override
    @Transactional
    public Invoice createInvoice(AddInvoiceRequest invoice) {
        var user = userService.getUserEntityById(invoice.userId());
        var invoiceEntity = invoiceMapper.toEntity(invoice);

        invoiceEntity.setUser(user);
        invoiceRepository.save(invoiceEntity);
        return invoiceMapper.toDto(invoiceEntity);
    }

    /**
     * Updates the status of an existing invoice identified by its unique identifier.
     *
     * @param id The ID of the invoice whose status to update.
     * @param invoice The UpdateInvoiceStatusRequest containing the new status.
     * @return the updated Invoice DTO with the new status.
     * @throws InvoiceNotFoundException if no invoice is found with the given ID.
     */
    @Override
    @Transactional
    public Invoice updateInvoiceStatus(Long id, UpdateInvoiceStatusRequest invoice) {
        return invoiceRepository
                .findById(id)
                .map(
                        entity -> {
                            entity.setStatus(invoice.status());
                            return entity;
                        })
                .map(invoiceRepository::save)
                .map(invoiceMapper::toDto)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    /**
     * Updates an existing invoice identified by its unique identifier. Maps the update request to
     * the existing entity and saves the changes.
     *
     * @param id The ID of the invoice to update.
     * @param data The UpdateInvoiceRequest containing the updated details for the invoice.
     * @return the updated Invoice DTO.
     * @throws InvoiceNotFoundException if no invoice is found with the given ID.
     */
    @Override
    @Transactional
    public Invoice updateInvoice(Long id, UpdateInvoiceRequest data) {
        return invoiceRepository
                .findById(id)
                .map(
                        i -> {
                            invoiceMapper.updateEntity(data, i);
                            return i;
                        })
                .map(invoiceRepository::save)
                .map(invoiceMapper::toDto)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    /**
     * Deletes an invoice identified by its unique identifier.
     *
     * @param id The ID of the invoice to delete.
     * @throws InvoiceNotFoundException if no invoice is found with the given ID.
     */
    @Override
    @Transactional
    public void deleteInvoice(Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return;
        }

        throw new InvoiceNotFoundException("id", id.toString());
    }
}

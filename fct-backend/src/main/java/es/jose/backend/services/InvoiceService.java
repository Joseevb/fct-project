package es.jose.backend.services;

import es.jose.backend.persistence.entities.InvoiceEntity;

import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceRequest;
import org.openapitools.model.UpdateInvoiceStatusRequest;
import org.springframework.core.io.Resource;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing invoices. Provides methods for retrieving, creating, updating,
 * changing status, and deleting invoices, as well as generating PDF representations.
 */
public interface InvoiceService {

    /**
     * Retrieves a list of all invoices, optionally filtered by user ID, status, or associated line
     * item ID.
     *
     * @param userId Optional ID of the user whose invoices to retrieve.
     * @param status Optional status of the invoices to retrieve.
     * @param lineItemId Optional ID of a line item to filter invoices by (invoices containing this
     *     line item).
     * @return a list of Invoice DTOs.
     */
    List<Invoice> getAllInvoices(
            Optional<Long> userId, Optional<InvoiceStatusEnum> status, Optional<Long> lineItemId);

    /**
     * Retrieves a list of all invoices.
     *
     * @return a list of all Invoice DTOs.
     */
    default List<Invoice> getAllInvoices() {
        return getAllInvoices(Optional.empty(), Optional.empty(), Optional.empty());
    }

    /**
     * Retrieves a list of all invoices for a specific user.
     *
     * @param userId The ID of the user whose invoices to retrieve.
     * @return a list of Invoice DTOs for the given user ID.
     */
    default List<Invoice> getAllInvoicesByUserId(Long userId) {
        return getAllInvoices(Optional.of(userId), Optional.empty(), Optional.empty());
    }

    /**
     * Retrieves a list of all invoices with a specific status.
     *
     * @param status The status of the invoices to retrieve.
     * @return a list of Invoice DTOs with the given status.
     */
    default List<Invoice> getAllInvoicesByStatus(InvoiceStatusEnum status) {
        return getAllInvoices(Optional.empty(), Optional.of(status), Optional.empty());
    }

    /**
     * Retrieves a list of all paid invoices.
     *
     * @return a list of Invoice DTOs with the status PAID.
     */
    List<Invoice> getAllPaidInvoices();

    /**
     * Retrieves a specific invoice by its unique identifier.
     *
     * @param id The ID of the invoice to retrieve.
     * @return the Invoice DTO corresponding to the given ID.
     */
    Invoice getInvoiceById(Long id);

    /**
     * Retrieves a specific invoice by its unique identifier and returns it as a PDF Resource.
     *
     * @param id The ID of the invoice to retrieve.
     * @return the invoice as a PDF Resource.
     */
    Resource getInvoiceByIdAsPDF(Long id);

    /**
     * Retrieves a specific Invoice entity by its unique identifier.
     *
     * @param id The ID of the invoice entity to retrieve.
     * @return the InvoiceEntity corresponding to the given ID.
     */
    InvoiceEntity getInvoiceEntityById(Long id);

    /**
     * Creates a new invoice based on the provided request.
     *
     * @param invoice The AddInvoiceRequest containing the details for the new invoice.
     * @return the created Invoice DTO.
     */
    Invoice createInvoice(AddInvoiceRequest invoice);

    /**
     * Updates an existing invoice identified by its unique identifier.
     *
     * @param id The ID of the invoice to update.
     * @param data The UpdateInvoiceRequest containing the updated details for the invoice.
     * @return the updated Invoice DTO.
     */
    Invoice updateInvoice(Long id, UpdateInvoiceRequest data);

    /**
     * Updates the status of an existing invoice identified by its unique identifier.
     *
     * @param id The ID of the invoice whose status to update.
     * @param invoice The UpdateInvoiceStatusRequest containing the new status.
     * @return the updated Invoice DTO with the new status.
     */
    Invoice updateInvoiceStatus(Long id, UpdateInvoiceStatusRequest invoice);

    /**
     * Deletes an invoice identified by its unique identifier.
     *
     * @param id The ID of the invoice to delete.
     */
    void deleteInvoice(Long id);
}

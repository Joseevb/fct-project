package es.jose.backend.services;

import org.openapitools.model.AddLineItemRequest;
import org.openapitools.model.LineItem;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing line items within invoices. Provides methods for retrieving,
 * creating, and deleting line items.
 */
public interface LineItemService {

    /**
     * Retrieves a list of all line items in the system.
     *
     * @return a list of all LineItem DTOs.
     */
    List<LineItem> getAllLineItems(Optional<Long> invoiceId);

    /**
     * Retrieves a specific line item by its unique identifier.
     *
     * @param id the ID of the line item to retrieve.
     * @return the LineItem DTO corresponding to the given ID.
     */
    LineItem getLineItemById(Long id);

    /**
     * Creates a new line item based on the provided request.
     *
     * @param lineItem the request object containing details for the new line item.
     * @return the created LineItem DTO.
     */
    LineItem createLineItem(AddLineItemRequest lineItem);

    /**
     * Deletes a line item by its ID.
     *
     * @param lineItemId the ID of the line item to delete.
     */
    void deleteLineItem(Long lineItemId);
}

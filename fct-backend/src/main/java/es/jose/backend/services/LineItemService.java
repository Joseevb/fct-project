package es.jose.backend.services;

import java.util.List;

import org.openapitools.model.AddLineItemRequest;
import org.openapitools.model.LineItem;

public interface LineItemService {

    List<LineItem> getAllLineItems();

    List<LineItem> getAllLineItemsByInvoiceId(Long invoiceId);

    LineItem getLineItemById(Long id);

    LineItem createLineItem(AddLineItemRequest lineItem);

    void deleteLineItem(Long lineItemId);
}

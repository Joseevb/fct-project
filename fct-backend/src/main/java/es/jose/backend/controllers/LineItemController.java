package es.jose.backend.controllers;

import es.jose.backend.services.LineItemService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.LineItemsApi;
import org.openapitools.model.AddLineItemRequest;
import org.openapitools.model.LineItem;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class LineItemController implements LineItemsApi {

    private final LineItemService lineItemService;

    @Override
    public ResponseEntity<LineItem> addLineItem(
            @Valid final AddLineItemRequest addLineItemRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(lineItemService.createLineItem(addLineItemRequest));
    }

    @Override
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteLineItemById(final Long id) {
        lineItemService.deleteLineItem(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<LineItem>> getAllLineItems(@Valid final Optional<Long> invoiceId) {
        return ResponseEntity.ok(lineItemService.getAllLineItems(invoiceId));
    }

    @Override
    public ResponseEntity<LineItem> getLineItemById(final Long id) {
        return ResponseEntity.ok(lineItemService.getLineItemById(id));
    }
}

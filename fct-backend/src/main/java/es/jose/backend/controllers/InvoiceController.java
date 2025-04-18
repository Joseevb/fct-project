package es.jose.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.openapitools.api.InvoiceApi;
import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceStatusRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.jose.backend.services.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class InvoiceController implements InvoiceApi {

    private final InvoiceService invoiceService;

    @Override
    public ResponseEntity<Invoice> addInvoice(@Valid AddInvoiceRequest addInvoiceRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(invoiceService.createInvoice(addInvoiceRequest));
    }

    @Override
    public ResponseEntity<Void> deleteInvoice(Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .build();
    }

    @Override
    public ResponseEntity<List<Invoice>> getAllInvoices(
            @Valid Long userId,
            @Valid InvoiceStatusEnum status) {
        return ResponseEntity
                .ok(invoiceService.getAllInvoices(Optional.ofNullable(userId), Optional.ofNullable(status)));
    }

    @Override
    public ResponseEntity<Invoice> getInvoiceById(Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @Override
    public ResponseEntity<Invoice> updateInvoice(Long id,
            @Valid UpdateInvoiceStatusRequest updateInvoiceStatusRequest) {
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(id, updateInvoiceStatusRequest));
    }

}

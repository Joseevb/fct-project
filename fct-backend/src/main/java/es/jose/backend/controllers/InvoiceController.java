package es.jose.backend.controllers;

import es.jose.backend.services.InvoiceService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.InvoicesApi;
import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceRequest;
import org.openapitools.model.UpdateInvoiceStatusRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class InvoiceController implements InvoicesApi {

    private final NativeWebRequest request;
    private final InvoiceService invoiceService;

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.of(request);
    }

    @Override
    public ResponseEntity<Invoice> addInvoice(@Valid AddInvoiceRequest addInvoiceRequest) {
        var invoice = invoiceService.createInvoice(addInvoiceRequest);

        return ResponseEntity.created(URI.create("/api/invoices/" + invoice.id())).body(invoice);
    }

    @Override
    public ResponseEntity<Void> deleteInvoice(Long id) {
        invoiceService.deleteInvoice(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<List<Invoice>> getAllInvoices(
            @Valid Optional<Long> userId,
            @Valid Optional<InvoiceStatusEnum> status,
            @Valid Optional<Long> lineItemId) {
        return ResponseEntity.ok(invoiceService.getAllInvoices(userId, status, lineItemId));
    }

    @Override
    public ResponseEntity<Invoice> getInvoiceById(Long id) {
        return ResponseEntity.ok(invoiceService.getInvoiceById(id));
    }

    @Override
    public ResponseEntity<Resource> getInvoiceByIdAsPDF(Long id) {
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=invoice.pdf")
                .body(invoiceService.getInvoiceByIdAsPDF(id));
    }

    @Override
    public ResponseEntity<Invoice> updateInvoice(
            Long id, @Valid UpdateInvoiceRequest updateInvoiceRequest) {
        var invoice = invoiceService.updateInvoice(id, updateInvoiceRequest);

        return ResponseEntity.created(URI.create("/api/invoices/" + invoice.id())).body(invoice);
    }

    @Override
    public ResponseEntity<Invoice> updateInvoiceStatus(
            Long id, @Valid UpdateInvoiceStatusRequest updateInvoiceStatusRequest) {
        return ResponseEntity.ok(
                invoiceService.updateInvoiceStatus(id, updateInvoiceStatusRequest));
    }
}

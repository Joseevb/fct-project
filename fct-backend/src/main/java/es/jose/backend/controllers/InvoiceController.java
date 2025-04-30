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
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @Override
    public ResponseEntity<List<Invoice>> getAllInvoices(
            @Valid Long userId, @Valid InvoiceStatusEnum status, @Valid Long lineItemId) {
        return ResponseEntity.ok(
                invoiceService.getAllInvoices(
                        Optional.ofNullable(userId),
                        Optional.ofNullable(status),
                        Optional.ofNullable(lineItemId)));
    }

    @Override
    public ResponseEntity<Invoice> getInvoiceById(Long id) {
        // TODO: add generation of PDF invoice
        return getRequest()
                .map(request -> MediaType.parseMediaTypes(request.getHeader(HttpHeaders.ACCEPT)))
                .orElse(List.of(MediaType.APPLICATION_JSON)) // fallback if no Accept header
                .stream()
                .filter(mediaType -> !mediaType.isWildcardType())
                .filter(
                        mediaType ->
                                mediaType.isCompatibleWith(MediaType.APPLICATION_PDF)
                                        || mediaType.isCompatibleWith(MediaType.APPLICATION_JSON))
                .findFirst()
                .map(
                        mediaType -> {
                            if (mediaType.isCompatibleWith(MediaType.APPLICATION_PDF)) {
                                var pdf = invoiceService.getInvoiceById(id);
                                return ResponseEntity.ok()
                                        .contentType(MediaType.APPLICATION_PDF)
                                        .body(pdf);
                            }
                            return ResponseEntity.ok(invoiceService.getInvoiceById(id));
                        })
                .orElseGet(() -> ResponseEntity.ok(invoiceService.getInvoiceById(id)));
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

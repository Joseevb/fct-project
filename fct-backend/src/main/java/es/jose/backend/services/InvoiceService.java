package es.jose.backend.services;

import es.jose.backend.persistence.entities.InvoiceEntity;

import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceRequest;
import org.openapitools.model.UpdateInvoiceStatusRequest;

import java.util.List;
import java.util.Optional;

public interface InvoiceService {

    List<Invoice> getAllInvoices(Optional<Long> userId, Optional<InvoiceStatusEnum> status);

    default List<Invoice> getAllInvoices() {
        return getAllInvoices(Optional.empty(), Optional.empty());
    }

    default List<Invoice> getAllInvoicesByUserId(Long userId) {
        return getAllInvoices(Optional.of(userId), Optional.empty());
    }

    default List<Invoice> getAllInvoicesByStatus(InvoiceStatusEnum status) {
        return getAllInvoices(Optional.empty(), Optional.of(status));
    }

    List<Invoice> getAllPaidInvoices();

    Invoice getInvoiceById(Long id);

    InvoiceEntity getInvoiceEntityById(Long id);

    Invoice createInvoice(AddInvoiceRequest invoice);

    Invoice updateInvoice(Long id, UpdateInvoiceRequest data);

    Invoice updateInvoiceStatus(Long id, UpdateInvoiceStatusRequest invoice);

    void deleteInvoice(Long id);
}

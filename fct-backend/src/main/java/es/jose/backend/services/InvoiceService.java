package es.jose.backend.services;

import java.util.List;
import java.util.Optional;

import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceRequest;
import org.openapitools.model.UpdateInvoiceStatusRequest;
import org.springframework.core.io.Resource;

import es.jose.backend.persistence.entities.InvoiceEntity;

public interface InvoiceService {

    List<Invoice> getAllInvoices(
            Optional<Long> userId, Optional<InvoiceStatusEnum> status, Optional<Long> lineItemId);

    default List<Invoice> getAllInvoices() {
        return getAllInvoices(Optional.empty(), Optional.empty(), Optional.empty());
    }

    default List<Invoice> getAllInvoicesByUserId(Long userId) {
        return getAllInvoices(Optional.of(userId), Optional.empty(), Optional.empty());
    }

    default List<Invoice> getAllInvoicesByStatus(InvoiceStatusEnum status) {
        return getAllInvoices(Optional.empty(), Optional.of(status), Optional.empty());
    }

    List<Invoice> getAllPaidInvoices();

    Invoice getInvoiceById(Long id);

    Resource getInvoiceByIdAsPDF(Long id);

    InvoiceEntity getInvoiceEntityById(Long id);

    Invoice createInvoice(AddInvoiceRequest invoice);

    Invoice updateInvoice(Long id, UpdateInvoiceRequest data);

    Invoice updateInvoiceStatus(Long id, UpdateInvoiceStatusRequest invoice);

    void deleteInvoice(Long id);
}

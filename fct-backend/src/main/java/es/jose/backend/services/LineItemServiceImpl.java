package es.jose.backend.services;

import java.time.OffsetDateTime;
import java.util.List;

import org.openapitools.model.AddLineItemRequest;
import org.openapitools.model.LineItem;
import org.springframework.stereotype.Service;

import es.jose.backend.exceptions.lineItem.LineItemNotFoundException;
import es.jose.backend.mappers.LineItemMapper;
import es.jose.backend.persistence.entities.AppointmentEntity;
import es.jose.backend.persistence.entities.LineItemEntity;
import es.jose.backend.persistence.entities.LineItemable;
import es.jose.backend.persistence.repositories.InvoiceRepository;
import es.jose.backend.persistence.repositories.LineItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class LineItemServiceImpl implements LineItemService {

    private final LineItemMapper lineItemMapper;
    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;
    private final LineItemRepository lineItemRepository;
    private final AppointmentService appointmentService;

    @Override
    public List<LineItem> getAllLineItems() {
        return lineItemRepository.findAll()
                .stream()
                .map(lineItemMapper::toDto)
                .toList();
    }

    @Override
    public List<LineItem> getAllLineItemsByInvoiceId(final Long invoiceId) {
        return lineItemRepository.findAllByInvoiceId(invoiceId)
                .stream()
                .map(lineItemMapper::toDto)
                .toList();
    }

    @Override
    public LineItem getLineItemById(Long id) {
        return lineItemRepository.findById(id)
                .map(lineItemMapper::toDto)
                .orElseThrow(() -> new LineItemNotFoundException("id", id.toString()));
    }

    @Override
    public LineItem createLineItem(final AddLineItemRequest lineItem) {
        final var invoice = invoiceService.getInvoiceEntityById(lineItem.invoiceId());
        final var lineItemObject = getLineItemObject(lineItem);

        LineItemEntity entity = lineItemMapper.toEntity(lineItem);
        entity.setInvoice(invoice);

        setLineItemObject(entity, lineItemObject);
        setLineItemSubtotal(entity, lineItemObject);

        entity = lineItemRepository.save(entity);

        updateInvoice(entity);

        return lineItemMapper.toDto(entity);
    }

    private LineItemable getLineItemObject(final AddLineItemRequest lineItem) {
        if (lineItem.appointmentId() != null) {
            return appointmentService.getAppointmentEntityById(lineItem.appointmentId());
        }

        if (lineItem.productId() != null) {
            // TODO: Implement logic for productId
            return null;
        }

        return null;
        // TODO: Implement rest of the logic
    }

    private LineItemEntity setLineItemObject(final LineItemEntity entity, final LineItemable object) {
        return switch (object) {
            case AppointmentEntity appointment -> {
                entity.setAppointment(appointment);
                yield entity;
            }
            default -> null;
        };
    }

    private LineItemEntity setLineItemSubtotal(final LineItemEntity entity, final Object object) {
        switch (object) {
            case AppointmentEntity appointment:
                log.info("Adding appointment: {}", appointment);
                entity.setSubtotal(appointment.getPrice());
                entity.setPriceAtPurchase(appointment.getPrice());
                return entity;
            default:
                return null;
        }
    }

    private void updateInvoice(LineItemEntity entity) {
        final var invoice = entity.getInvoice();
        invoice.setUpdatedAt(OffsetDateTime.now());
        invoice.setTotalPrice(invoice.getTotalPrice().add(entity.getSubtotal()));
        invoiceRepository.save(invoice);
    }

    @Override
    public void deleteLineItem(Long lineItemId) {
        if (lineItemRepository.findById(lineItemId).isPresent()) {
            lineItemRepository.deleteById(lineItemId);
        }

        throw new LineItemNotFoundException("id", lineItemId.toString());
    }

}

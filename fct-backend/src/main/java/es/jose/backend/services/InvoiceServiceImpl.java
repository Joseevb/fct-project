package es.jose.backend.services;

import es.jose.backend.exceptions.invoice.InvoiceNotFoundException;
import es.jose.backend.mappers.InvoiceMapper;
import es.jose.backend.persistence.entities.InvoiceEntity;
import es.jose.backend.persistence.repositories.InvoiceRepository;

import jakarta.persistence.criteria.Predicate;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddInvoiceRequest;
import org.openapitools.model.Invoice;
import org.openapitools.model.InvoiceStatusEnum;
import org.openapitools.model.UpdateInvoiceRequest;
import org.openapitools.model.UpdateInvoiceStatusRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

    private final UserService userService;
    private final InvoiceMapper invoiceMapper;
    private final InvoiceRepository invoiceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Invoice> getAllInvoices(Optional<Long> userId, Optional<InvoiceStatusEnum> status) {
        Specification<InvoiceEntity> spec =
                (root, query, cb) -> {
                    var predicates = new ArrayList<>();

                    userId.ifPresent(
                            id -> predicates.add(cb.equal(root.get("user").get("id"), id)));
                    status.ifPresent(st -> predicates.add(cb.equal(root.get("status"), st)));

                    return cb.and(predicates.toArray(new Predicate[0]));
                };

        return invoiceRepository.findAll(spec).stream().map(invoiceMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Invoice> getAllPaidInvoices() {
        Specification<InvoiceEntity> spec =
                (root, query, cb) -> {
                    var predicates = List.of(cb.equal(root.get("status"), InvoiceStatusEnum.PAID));

                    return cb.and(predicates.toArray(new Predicate[0]));
                };
        return invoiceRepository.findAll(spec).stream().map(invoiceMapper::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Invoice getInvoiceById(Long id) {
        return invoiceRepository
                .findById(id)
                .map(invoiceMapper::toDto)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceEntity getInvoiceEntityById(Long id) {
        return invoiceRepository
                .findById(id)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    @Override
    @Transactional
    public Invoice createInvoice(AddInvoiceRequest invoice) {
        var user = userService.getUserEntityById(invoice.userId());
        var invoiceEntity = invoiceMapper.toEntity(invoice);

        invoiceEntity.setUser(user);
        invoiceRepository.save(invoiceEntity);
        return invoiceMapper.toDto(invoiceEntity);
    }

    @Override
    @Transactional
    public Invoice updateInvoiceStatus(Long id, UpdateInvoiceStatusRequest invoice) {
        return invoiceRepository
                .findById(id)
                .map(
                        entity -> {
                            entity.setStatus(invoice.status());
                            return entity;
                        })
                .map(invoiceRepository::save)
                .map(invoiceMapper::toDto)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    @Override
    @Transactional
    public Invoice updateInvoice(Long id, UpdateInvoiceRequest data) {
        return invoiceRepository
                .findById(id)
                .map(
                        i -> {
                            invoiceMapper.updateEntity(data, i);
                            return i;
                        })
                .map(invoiceRepository::save)
                .map(invoiceMapper::toDto)
                .orElseThrow(() -> new InvoiceNotFoundException("id", id.toString()));
    }

    @Override
    @Transactional
    public void deleteInvoice(Long id) {
        if (invoiceRepository.existsById(id)) {
            invoiceRepository.deleteById(id);
            return;
        }

        throw new InvoiceNotFoundException("id", id.toString());
    }
}

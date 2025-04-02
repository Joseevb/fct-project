package es.jose.backend.persistence.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import es.jose.backend.persistence.entities.LineItemEntity;

@Repository
public interface LineItemRepository extends JpaRepository<LineItemEntity, Long> {

    List<LineItemEntity> findAllByInvoiceId(Long invoiceId);

}

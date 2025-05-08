package es.jose.backend.utils;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import es.jose.backend.persistence.entities.InvoiceEntity;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Component
@RequiredArgsConstructor
public class ThymeleafUtils {

    private final TemplateEngine templateEngine;

    public byte[] parseThymeleafTemplateAsPDF(InvoiceEntity invoice) {

        var context = new Context();

        context.setVariable("date", invoice.getCreatedAt().toLocalDate());
        context.setVariable("invoiceNumber", invoice.getId());
        context.setVariable(
                "customerName", invoice.getUser().getFirstName() + invoice.getUser().getLastName());

        List<Map<String, Object>> items =
                invoice.getLineItems().stream()
                        .map(
                                item -> {
                                    String description =
                                            item.getAppointment() != null
                                                    ? "Appointment"
                                                    : item.getProduct() != null
                                                            ? item.getProduct().getId().toString()
                                                            : "Unknown Item";

                                    Map<String, Object> map = new HashMap<>();
                                    map.put("description", description);
                                    map.put("quantity", item.getQuantity());
                                    map.put("unitPrice", item.getPriceAtPurchase());
                                    map.put("total", item.getSubtotal());
                                    log.info("Item: {}", map);
                                    return map;
                                })
                        .toList();

        context.setVariable("items", items);
        context.setVariable("subtotal", calculateSubtotal(items));
        context.setVariable("tax", calculateTax(invoice.getTotalPrice()));
        context.setVariable("total", invoice.getTotalPrice());

        final String htmlContent = templateEngine.process("invoice", context);

        log.info("--- START HTML Content ---");
        log.info(htmlContent);
        log.info("--- END HTML Content ---");

        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            // It's good practice to specify the base URI for resolving relative paths (CSS, images)
            // If your CSS/images are also classpath resources, you might need to configure this.
            // builder.withHtmlContent(htmlContent, "classpath:/templates/"); // Example if base is
            // templates dir
            new PdfRendererBuilder()
                    .useFastMode()
                    .withHtmlContent(htmlContent, null)
                    .toStream(outputStream)
                    .run();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF for invoice " + invoice.getId(), e);
        }
    }

    private BigDecimal calculateSubtotal(List<Map<String, Object>> items) {
        return items.stream()
                .map(item -> new BigDecimal(item.get("total").toString()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateTax(BigDecimal totalPrice) {
        return totalPrice.multiply(BigDecimal.valueOf(0.21)).setScale(2, RoundingMode.HALF_UP);
    }
}

package es.jose.backend.utils;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import es.jose.backend.persistence.entities.InvoiceEntity;

import lombok.experimental.UtilityClass;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@UtilityClass
public class ThymeleafUtils {
    public byte[] parseThymeleafTemplateAsPDF(InvoiceEntity invoice) {
        // 1. Set up Thymeleaf
        var templateResolver = new ClassLoaderTemplateResolver();
        templateResolver.setPrefix("templates/"); // Optional if default
        templateResolver.setSuffix(".html");
        templateResolver.setTemplateMode(TemplateMode.HTML);
        templateResolver.setCharacterEncoding("UTF-8");

        var templateEngine = new TemplateEngine();
        templateEngine.setTemplateResolver(templateResolver);

        var context = new Context();

        // 2. Set context variables
        context.setVariable("date", invoice.getCreatedAt().toLocalDate()); // or format as string
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
                                    return map;
                                })
                        .toList();

        context.setVariable("items", items);
        context.setVariable("subtotal", calculateSubtotal(items));
        context.setVariable("tax", calculateTax(invoice.getTotalPrice()));
        context.setVariable("total", invoice.getTotalPrice());

        // 3. Generate HTML
        final String htmlContent = templateEngine.process("invoice", context);

        // 4. Generate PDF from HTML
        try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            var builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(htmlContent, null);
            builder.toStream(outputStream);
            builder.run();
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private BigDecimal calculateSubtotal(List<Map<String, Object>> items) {
        return items.stream()
                .map(item -> new BigDecimal(item.get("total").toString()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal calculateTax(BigDecimal totalPrice) {
        // You can change the tax logic here; this example assumes 10% tax
        return totalPrice.multiply(BigDecimal.valueOf(0.10)).setScale(2, RoundingMode.HALF_UP);
    }
}

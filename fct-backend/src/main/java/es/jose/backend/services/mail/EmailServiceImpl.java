package es.jose.backend.services.mail;

import lombok.RequiredArgsConstructor;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service implementation for sending emails. Uses Spring's JavaMailSender to send simple text
 * emails.
 */
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    /**
     * Sends a simple email message. Configures a SimpleMailMessage with sender, recipient, subject,
     * and text content, then sends it using the JavaMailSender.
     *
     * @param to The recipient's email address.
     * @param subject The subject of the email.
     * @param content The content of the email. Converted to String for the email body.
     * @param <T> The type of the content.
     */
    @Override
    public <T> void sendSimpleMessage(String to, String subject, T content) {
        final var message = new SimpleMailMessage();

        message.setFrom("joseevasquezbarboza@gmail.com"); // TODO: Use a configured 'from' address
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content.toString());

        mailSender.send(message);
    }
}

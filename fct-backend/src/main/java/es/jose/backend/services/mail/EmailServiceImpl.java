package es.jose.backend.services.mail;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public <T> void sendSimpleMessage(String to, String subject, T content) {
        final var message = new SimpleMailMessage();

        message.setFrom("joseevasquezbarboza@gmail.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(content.toString());

        mailSender.send(message);
    }

}

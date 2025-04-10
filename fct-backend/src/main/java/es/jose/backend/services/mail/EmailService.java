package es.jose.backend.services.mail;

public interface EmailService {

    <T> void sendSimpleMessage(String to, String subject, T message);

}

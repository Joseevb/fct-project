package es.jose.backend.services.mail;

public interface EmailService {

    /**
     * Sends a simple email message.
     *
     * @param to The recipient's email address.
     * @param subject The subject of the email.
     * @param message The content of the email. Can be of any type T, which will be converted to a
     *     String.
     * @param <T> The type of the message content.
     */
    <T> void sendSimpleMessage(String to, String subject, T message);
}

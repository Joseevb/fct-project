package es.jose.backend.services.mail;

import es.jose.backend.persistence.entities.UserEntity;

public interface EmailVerificationService {

    void generateAndSendVerificationEmail(UserEntity user);

    void verifyEmail(String token);
}

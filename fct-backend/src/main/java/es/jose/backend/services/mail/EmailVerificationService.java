package es.jose.backend.services.mail;

import es.jose.backend.persistence.entities.UserEntity;

/**
 * Service interface for managing email verification. Provides methods for generating and sending
 * verification emails and verifying email tokens.
 */
public interface EmailVerificationService {

    /**
     * Generates a verification token for the given user and sends a verification email.
     *
     * @param user The UserEntity for whom to generate and send the verification email.
     */
    void generateAndSendVerificationEmail(UserEntity user);

    /**
     * Verifies an email address using the provided token. Marks the user's email as verified if the
     * token is valid and not expired.
     *
     * @param token The verification token received from the user.
     */
    void verifyEmail(String token);
}

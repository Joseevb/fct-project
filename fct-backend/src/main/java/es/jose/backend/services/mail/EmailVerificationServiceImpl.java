package es.jose.backend.services.mail;

import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.entities.VerificationTokenEntity;
import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.persistence.repositories.VerificationTokenRepository;
import es.jose.backend.utils.OtpNumberGenerator;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Service implementation for managing email verification. Handles the generation, sending, and
 * verification of email verification tokens. Interacts with VerificationTokenRepository,
 * UserRepository, EmailService, and OtpNumberGenerator.
 */
@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final OtpNumberGenerator otpNumberGenerator;

    @Value("${app.verification.expiration}")
    private long expirationMinutes;

    /**
     * Generates a verification token for the given user and sends a verification email. The token
     * is saved with an expiration time.
     *
     * @param user The UserEntity for whom to generate and send the verification email.
     */
    @Override
    public void generateAndSendVerificationEmail(UserEntity user) {
        String token = otpNumberGenerator.generateOtp();
        Instant expiryDate = Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES);

        var verificationToken =
                VerificationTokenEntity.builder()
                        .token(token)
                        .user(user)
                        .expiration(expiryDate)
                        .build();
        tokenRepository.save(verificationToken);

        String emailBody =
                """
                Hello %s,

                Enter the following code in the verification form to verify your email address:

                %s

                This code expires in %d minutes.
                """
                        .formatted(
                                user.getFirstName(),
                                verificationToken.getToken(),
                                expirationMinutes);

        emailService.sendSimpleMessage(user.getEmail(), "Email Verification", emailBody);
    }

    /**
     * Verifies an email address using the provided token. Finds the token, checks for expiration,
     * activates the user's email status if valid, and deletes the token.
     *
     * @param token The verification token received from the user.
     * @throws RuntimeException if the token is invalid, expired, or not found.
     */
    @Override
    public void verifyEmail(String token) {
        var verificationToken =
                tokenRepository
                        .findByToken(token)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid or expired verification token"));

        if (verificationToken.getExpiration().isBefore(Instant.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        UserEntity user = verificationToken.getUser();
        user.setIsActive(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);
    }
}

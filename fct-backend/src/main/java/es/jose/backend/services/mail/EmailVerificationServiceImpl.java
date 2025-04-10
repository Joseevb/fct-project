package es.jose.backend.services.mail;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.entities.VerificationTokenEntity;
import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.persistence.repositories.VerificationTokenRepository;
import es.jose.backend.utils.RandomStringGenerator;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailVerificationServiceImpl implements EmailVerificationService {

    private final VerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RandomStringGenerator tokenGenerator;

    @Value("${app.verification.expiration}")
    private long expirationMinutes;

    @Override
    public void generateAndSendVerificationEmail(UserEntity user) {
        String token = tokenGenerator.generate(32);
        Instant expiryDate = Instant.now().plus(expirationMinutes, ChronoUnit.MINUTES);

        var verificationToken = new VerificationTokenEntity(null, token, user, expiryDate);
        tokenRepository.save(verificationToken);

        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + token;
        String emailBody = """
                Hello %s,

                Please verify your email by clicking the link below:

                %s

                This link expires in %d minutes.
                """.formatted(user.getFirstName(), verificationUrl, expirationMinutes);

        emailService.sendSimpleMessage(user.getEmail(), "Email Verification", emailBody);
    }

    @Override
    public void verifyEmail(String token) {
        var verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token"));

        if (verificationToken.getExpiration().isBefore(Instant.now())) {
            throw new RuntimeException("Verification token has expired");
        }

        UserEntity user = verificationToken.getUser();
        user.setIsActive(true);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);
    }
}

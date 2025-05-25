package es.jose.backend.services.security;

import es.jose.backend.exceptions.AuthenticationFailedException;
import es.jose.backend.security.LocalAuthUser;
import es.jose.backend.services.UserService;
import es.jose.backend.services.mail.EmailVerificationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.openapitools.model.LoginResponse;
import org.openapitools.model.RegisterRequest;
import org.openapitools.model.RegisterResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

/**
 * Service implementation for authentication and authorization operations. Handles user login,
 * registration, and JWT token management. Interacts with UserService, EmailVerificationService,
 * JwtEncoder, and JwtDecoder.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final JwtEncoder jwtEncoder;
    private final JwtDecoder jwtDecoder;
    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    @Value("${app.refresh-token.expiration-days}")
    private long REFRESH_TOKEN_EXPIRATION_DAYS;

    @Value("${app.jwt.expiration-minutes}")
    private long AUTH_TOKEN_EXPIRATION_MINUTES;

    /**
     * Handles the user login process. Generates authentication and refresh tokens upon successful
     * authentication.
     *
     * @param authentication The Spring Security Authentication object containing user credentials.
     * @return A LoginResponse containing generated tokens and user information.
     */
    @Override
    public LoginResponse login(final Authentication authentication) {
        final var now = Instant.now();

        final var authorities =
                authentication.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .collect(Collectors.toList());

        final var jwtClaims =
                JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plus(AUTH_TOKEN_EXPIRATION_MINUTES, ChronoUnit.MINUTES))
                        .subject(authentication.getName())
                        .claim("authorities", authorities)
                        .build();

        final String jwt = jwtEncoder.encode(JwtEncoderParameters.from(jwtClaims)).getTokenValue();

        final var refreshClaims =
                JwtClaimsSet.builder()
                        .issuer("self")
                        .issuedAt(now)
                        .expiresAt(now.plus(REFRESH_TOKEN_EXPIRATION_DAYS, ChronoUnit.DAYS))
                        .subject(authentication.getName())
                        .claim("type", "refresh")
                        .claim("authorities", authorities)
                        .build();

        final String refreshToken =
                jwtEncoder.encode(JwtEncoderParameters.from(refreshClaims)).getTokenValue();

        final var user = (LocalAuthUser) authentication.getPrincipal();

        return LoginResponse.builder()
                .userId(user.getUser().getId())
                .role(user.getUser().getRole())
                .jwt(jwt)
                .refreshToken(refreshToken)
                .build();
    }

    /**
     * Handles the user registration process. Creates a new user account and sends a verification
     * email.
     *
     * @param register The RegisterRequest containing user registration details.
     * @return A RegisterResponse indicating the result of the registration.
     */
    @Override
    public RegisterResponse register(final RegisterRequest register) {
        final var user = userService.createUser(register);

        emailVerificationService.generateAndSendVerificationEmail(
                userService.getUserEntityById(user.id()));
        return RegisterResponse.builder()
                .userId(user.id())
                .response("User registered successfully")
                .build();
    }

    /**
     * Refreshes an expired authentication token using a valid refresh token. Decodes the refresh
     * token, validates its type and expiration, and issues a new authentication token.
     *
     * @param refreshToken The refresh token used to request a new authentication token.
     * @return A LoginResponse containing the new authentication token and the (possibly same)
     *     refresh token.
     * @throws AuthenticationFailedException if the refresh token is invalid or expired.
     */
    @Override
    public LoginResponse refreshSession(final String refreshToken) {
        log.info("Validating token: {}", refreshToken);
        try {
            final var jwt = jwtDecoder.decode(refreshToken);

            final String tokenType = jwt.getClaim("type");
            if (tokenType == null || !"refresh".equals(tokenType)) {
                throw new AuthenticationFailedException("Invalid refresh token");
            }

            final Instant now = Instant.now();
            final String username = jwt.getSubject();
            final var authorities = jwt.getClaim("authorities");

            final JwtClaimsSet newAccessTokenClaims =
                    JwtClaimsSet.builder()
                            .issuer("self")
                            .issuedAt(now)
                            .expiresAt(now.plus(AUTH_TOKEN_EXPIRATION_MINUTES, ChronoUnit.MINUTES))
                            .subject(username)
                            .claim("authorities", authorities)
                            .build();

            final String newAccessToken =
                    jwtEncoder
                            .encode(JwtEncoderParameters.from(newAccessTokenClaims))
                            .getTokenValue();

            final var user = userService.getUserByUsernameOrEmail(username);

            return LoginResponse.builder()
                    .userId(user.id())
                    .role(user.role())
                    .jwt(newAccessToken)
                    .refreshToken(refreshToken)
                    .build();

        } catch (final JwtException e) {
            e.printStackTrace();
            throw new AuthenticationFailedException("Invalid refresh token");
        }
    }
}

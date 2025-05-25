package es.jose.backend.services.security;

import org.openapitools.model.LoginResponse;
import org.openapitools.model.RegisterRequest;
import org.openapitools.model.RegisterResponse;
import org.springframework.security.core.Authentication;

/**
 * Service interface for authentication and authorization operations. Provides methods for user
 * login, registration, and token refreshing.
 */
public interface AuthService {

    /**
     * Handles the user login process. Generates authentication and refresh tokens upon successful
     * authentication.
     *
     * @param authentication The Spring Security Authentication object containing user credentials.
     * @return A LoginResponse containing generated tokens and user information.
     */
    LoginResponse login(Authentication authentication);

    /**
     * Handles the user registration process. Creates a new user account and potentially triggers
     * email verification.
     *
     * @param register The RegisterRequest containing user registration details.
     * @return A RegisterResponse indicating the result of the registration.
     */
    RegisterResponse register(RegisterRequest register);

    /**
     * Refreshes an expired authentication token using a valid refresh token. Issues a new
     * authentication token and may return the same refresh token.
     *
     * @param refreshToken The refresh token used to request a new authentication token.
     * @return A LoginResponse containing the new authentication token and the (possibly same)
     *     refresh token.
     */
    LoginResponse refreshSession(String refreshToken);
}

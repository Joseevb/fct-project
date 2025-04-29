package es.jose.backend.services.security;

import org.openapitools.model.LoginResponse;
import org.openapitools.model.RegisterRequest;
import org.openapitools.model.RegisterResponse;
import org.springframework.security.core.Authentication;

/** AuthService */
public interface AuthService {

    LoginResponse login(Authentication authentication);

    RegisterResponse register(RegisterRequest register);

    LoginResponse refreshSession(String refreshToken);
}

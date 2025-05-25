package es.jose.backend.controllers;

import es.jose.backend.services.mail.EmailVerificationService;
import es.jose.backend.services.security.AuthService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.AuthApi;
import org.openapitools.model.LoginRequest;
import org.openapitools.model.LoginResponse;
import org.openapitools.model.RefreshTokenRequest;
import org.openapitools.model.RegisterRequest;
import org.openapitools.model.RegisterResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/** AuthController - Handles authentication, user registration, and token refreshing. */
@RestController
@RequiredArgsConstructor
public class AuthController implements AuthApi {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final EmailVerificationService emailVerificationService;

    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest login) {
        var authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                login.username(), login.password()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return ResponseEntity.ok(authService.login(authentication));
    }

    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest register) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(register));
    }

    public ResponseEntity<LoginResponse> refreshSession(
            @RequestBody @Valid RefreshTokenRequest refreshToken) {
        return ResponseEntity.ok(authService.refreshSession(refreshToken.refreshToken()));
    }

    public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
        emailVerificationService.verifyEmail(token);
        return ResponseEntity.ok(Map.of("message", "Email verified successfully"));
    }
}

package es.jose.backend.services.security;

import es.jose.backend.exceptions.user.UserNotFoundException;
import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.security.LocalAuthUser;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

/**
 * Service implementation for checking user security and authorization properties. Provides methods
 * to retrieve the currently authenticated user from the security context. Interacts with the
 * UserRepository.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserSecurityServiceImpl implements UserSecurityService {

    private final UserRepository userRepository;

    /**
     * Gets the authenticated user from the Spring Security context. Supports both LocalAuthUser and
     * Jwt principals. Retrieves the user from the repository if the principal is a Jwt.
     *
     * @return the authenticated LocalAuthUser or null if the principal is not supported or user not
     *     found.
     * @throws UserNotFoundException if the principal is a Jwt and the user cannot be found in the
     *     repository.
     */
    @Override
    public LocalAuthUser getAuthUser() {
        final var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof final LocalAuthUser authUser) {
            log.info("Authenticated user (AuthUser): {}", authUser);
            return authUser;
        }

        if (principal instanceof final Jwt jwt) {
            log.info("Subject: {}", jwt.getSubject());
            return new LocalAuthUser(
                    userRepository
                            .findByUsernameOrEmail(jwt.getSubject())
                            .orElseThrow(
                                    () ->
                                            new UserNotFoundException(
                                                    "username or email", jwt.getSubject())));
        }

        return null;
    }
}

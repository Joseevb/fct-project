package es.jose.backend.services.security;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import es.jose.backend.exceptions.user.UserNotFoundException;
import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.security.AuthUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserSecurityServiceImpl implements UserSecurityService {

    private final UserRepository userRepository;

    @Override
    public AuthUser getAuthUser() {
        final var principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof final AuthUser authUser) {
            log.info("Authenticated user (AuthUser): {}", authUser);
            return authUser;
        }

        if (principal instanceof final Jwt jwt) {
            log.info("Subject: {}", jwt.getSubject());
            return new AuthUser(userRepository.findByUsernameOrEmail(jwt.getSubject())
                    .orElseThrow(() -> new UserNotFoundException("username or email", jwt.getSubject())));
        }

        return null;

    }

}

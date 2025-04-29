package es.jose.backend.services.security;

import es.jose.backend.security.LocalAuthUser;

import org.springframework.security.core.context.SecurityContextHolder;

/** UserSecurityService */
public interface UserSecurityService {

    /**
     * Check if the authenticated user is modifying their own account.
     *
     * @param userId The ID of the user being modified.
     * @return true if the user is the owner of the account, false otherwise.
     */
    default boolean isOwner(final Long userId) {
        return getAuthUser().getUser().getId().equals(userId);
    }
    ;

    /**
     * Gets the authenticated user.
     *
     * @return the authenticated user or null if not authenticated.
     */
    LocalAuthUser getAuthUser();

    /**
     * Checks if the authenticated user is an admin. Uses {@link #getAuthUser()} internally.
     *
     * @return true if the user is an admin, false otherwise.
     */
    default boolean isAdmin() {
        final var authentication = SecurityContextHolder.getContext().getAuthentication();

        return authentication != null
                && authentication.getAuthorities().stream()
                        .anyMatch(
                                grantedAuthority ->
                                        grantedAuthority.getAuthority().equals("ROLE_ADMIN"));
    }
}

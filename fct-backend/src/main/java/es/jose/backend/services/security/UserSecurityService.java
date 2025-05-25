package es.jose.backend.services.security;

import es.jose.backend.security.LocalAuthUser;

import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Service interface for checking user security and authorization properties. Provides methods to
 * check if the authenticated user is an owner or an admin.
 */
public interface UserSecurityService {

    /**
     * Check if the authenticated user is modifying their own account. Compares the ID of the
     * currently authenticated user with the provided user ID.
     *
     * @param userId The ID of the user being modified.
     * @return true if the user is the owner of the account, false otherwise.
     */
    default boolean isOwner(final Long userId) {
        return getAuthUser().getUser().getId().equals(userId);
    }
    ;

    /**
     * Gets the authenticated user. Retrieves the principal from the Spring SecurityContextHolder
     * and casts it to LocalAuthUser.
     *
     * @return the authenticated user or null if not authenticated or principal is not
     *     LocalAuthUser.
     */
    LocalAuthUser getAuthUser();

    /**
     * Checks if the authenticated user is an admin. Retrieves the user's authorities from the
     * security context and checks for the ROLE_ADMIN authority. Uses {@link #getAuthUser()}
     * internally.
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

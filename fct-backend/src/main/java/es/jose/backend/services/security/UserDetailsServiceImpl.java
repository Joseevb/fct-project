package es.jose.backend.services.security;

import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.security.LocalAuthUser;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom implementation of Spring Security's UserDetailsService. Loads user details by username or
 * email for authentication purposes. Interacts with the UserRepository.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads user details by username or email. Required by Spring Security for authentication.
     *
     * @param username The username (or email) of the user to load.
     * @return A UserDetails object representing the user.
     * @throws UsernameNotFoundException if the user is not found.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsernameOrEmail(username)
                .map(LocalAuthUser::new)
                .orElseThrow(
                        () -> new UsernameNotFoundException("User name not found: " + username));
    }
}

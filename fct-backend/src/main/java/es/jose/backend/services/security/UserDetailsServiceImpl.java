package es.jose.backend.services.security;

import es.jose.backend.persistence.repositories.UserRepository;
import es.jose.backend.security.LocalAuthUser;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** UserDetailsServiceImpl */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository
                .findByUsernameOrEmail(username)
                .map(LocalAuthUser::new)
                .orElseThrow(
                        () -> new UsernameNotFoundException("User name not found: " + username));
    }
}

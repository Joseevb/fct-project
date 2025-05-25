package es.jose.backend.security;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

public class CustomJwtAuthenticationConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private final JwtGrantedAuthoritiesConverter defaultConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public Collection<GrantedAuthority> convert(@NonNull Jwt jwt) {
        Collection<GrantedAuthority> authorities = defaultConverter.convert(jwt);

        // ✅ Extract "authorities" claim and convert it to Spring Security roles
        List<String> roles = jwt.getClaim("authorities");
        if (roles != null) {
            authorities.addAll(
                    roles.stream()
                            .map(SimpleGrantedAuthority::new) // ✅ Convert to GrantedAuthority
                            .collect(Collectors.toList()));
        }

        return authorities;
    }
}

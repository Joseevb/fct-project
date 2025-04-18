package es.jose.backend.security;

import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.ImmutableJWKSet;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;

import es.jose.backend.config.RsaKeyConfigProperties;
import es.jose.backend.services.security.UserSecurityService;

import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final UserSecurityService userSecurityService;
    private final RsaKeyConfigProperties rsaKeyConfigProperties;

    private static final String BASE_PATH = "/api/v1";

    private static final String[] ALLOWED_PATHS = {
        "/h2-console/**",
        "/api/v1/auth/**",
        "/api/v1/error/**",
        "/api/v1/auth",
        "/error/**",
        "/swagger-ui/**",
        "/v3/api-docs/**"
    };

    private static final String[] ALLOWED_ORIGINS = {
        "http://localhost:5173", "http://localhost:4173", "http://localhost",
    };

    @Bean
    public AuthenticationManager authManager() {
        var authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return new ProviderManager(authProvider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(ALLOWED_ORIGINS)); // Add allowed origins
        configuration.setAllowedMethods(List.of("*")); // Add allowed methods
        configuration.setAllowedHeaders(
                List.of("*")); // Add allowed headers, or specify them as needed
        configuration.setAllowCredentials(true); // Enable sending credentials (cookies, etc.)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration(
                "/**", configuration); // Apply this config to all endpoints
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {

        return http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .headers(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(
                        auth ->
                                auth.requestMatchers(HttpMethod.GET, BASE_PATH.concat("/user/**"))
                                        .permitAll()
                                        .requestMatchers(ALLOWED_PATHS)
                                        .permitAll()
                                        .anyRequest()
                                        .authenticated())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .oauth2ResourceServer(
                        (oauth2) ->
                                oauth2.jwt(
                                        (jwt) ->
                                                jwt.decoder(jwtDecoder())
                                                        .jwtAuthenticationConverter(
                                                                jwtAuthenticationConverter())))
                .userDetailsService(userDetailsService)
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withPublicKey(rsaKeyConfigProperties.publicKey()).build();
    }

    @Bean
    public JwtEncoder jwtEncoder() {
        var jwk =
                new RSAKey.Builder(rsaKeyConfigProperties.publicKey())
                        .privateKey(rsaKeyConfigProperties.privateKey())
                        .build();

        JWKSource<SecurityContext> jwks = new ImmutableJWKSet<>(new JWKSet(jwk));
        return new NimbusJwtEncoder(jwks);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new CustomJwtAuthenticationConverter());
        return converter;
    }

    @Bean
    public UserSecurityService userSecurityService() {
        return this.userSecurityService;
    }
}

package es.jose.backend.security;

import java.io.IOException;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import es.jose.backend.services.security.UserSecurityService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PasswordVisibilitySerializer extends JsonSerializer<String> {

    private final UserSecurityService userSecurityService;

    @Override
    public void serialize(String password, JsonGenerator jsonGenerator, SerializerProvider serializerProvider)
            throws IOException {
        if (userSecurityService.isAdmin()) {
            jsonGenerator.writeString(password);
        } else
            jsonGenerator.writeString("******");
    }
}

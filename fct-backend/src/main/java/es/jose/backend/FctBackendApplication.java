package es.jose.backend;

import es.jose.backend.config.RsaKeyConfigProperties;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
@EnableConfigurationProperties(RsaKeyConfigProperties.class)
public class FctBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FctBackendApplication.class, args);
    }
}

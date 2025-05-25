package es.jose.backend.persistence.entities.keys;

import jakarta.persistence.Embeddable;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = {"userId", "productId"})
@AllArgsConstructor
public class CartKey implements Serializable {

    private Long userId;
    private Long productId;
}

package es.jose.backend.controllers;

import es.jose.backend.services.AddressService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.AddressApi;
import org.openapitools.model.AddAddressRequest;
import org.openapitools.model.Address;
import org.openapitools.model.UpdateAddressRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class AddressController implements AddressApi {

    private final AddressService addressService;

    @Override
    public ResponseEntity<Address> addAddress(@Valid AddAddressRequest addAddressRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(addressService.createAddress(addAddressRequest));
    }

    @Override
    public ResponseEntity<Void> deleteAddress(Long id) {
        addressService.deleteAddress(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Address> getAddressById(Long id) {
        return ResponseEntity.ok(addressService.getAddressById(id));
    }

    @Override
    public ResponseEntity<List<Address>> getAllAddresses(Optional<Long> userId) {
        return ResponseEntity.ok(addressService.getAllAddresses());
    }

    @Override
    public ResponseEntity<Address> updateAddress(
            Long id, @Valid UpdateAddressRequest updateAddressRequest) {
        return ResponseEntity.ok(addressService.updateAddress(id, updateAddressRequest));
    }
}

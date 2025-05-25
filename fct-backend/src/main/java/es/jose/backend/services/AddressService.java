package es.jose.backend.services;

import es.jose.backend.persistence.entities.AddressEntity;

import org.openapitools.model.AddAddressRequest;
import org.openapitools.model.Address;
import org.openapitools.model.AddressTypeEnum;
import org.openapitools.model.UpdateAddressRequest;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing addresses. Provides methods for retrieving, creating, updating,
 * and deleting address information.
 */
public interface AddressService {

    /**
     * Retrieves a list of all addresses in the system.
     *
     * @return a list of Address DTOs.
     */
    List<Address> getAllAddresses();

    /**
     * Retrieves a list of addresses associated with a specific user ID.
     *
     * @param userId The ID of the user whose addresses to retrieve.
     * @return a list of Address DTOs for the given user ID.
     */
    List<Address> getAddressesByUserId(Long userId);

    /**
     * Retrieves a specific address by its unique identifier.
     *
     * @param id The ID of the address to retrieve.
     * @return the Address DTO corresponding to the given ID.
     */
    Address getAddressById(Long id);

    /**
     * Retrieves a specific Address entity by its unique identifier.
     *
     * @param id The ID of the address entity to retrieve.
     * @return the AddressEntity corresponding to the given ID.
     */
    AddressEntity getAddressEntityById(Long id);

    /**
     * Retrieves an address for a specific user by their ID and address type.
     *
     * @param userId The ID of the user.
     * @param addressType The type of address (e.g., SHIPPING, BILLING).
     * @return an Optional containing the Address DTO if found, otherwise empty.
     */
    Optional<Address> getAddressByUserIdAndType(Long userId, AddressTypeEnum addressType);

    /**
     * Creates a new address.
     *
     * @param address The AddAddressRequest containing the details for the new address.
     * @return the created Address DTO.
     */
    Address createAddress(AddAddressRequest address);

    /**
     * Updates an existing address identified by its unique identifier.
     *
     * @param id The ID of the address to update.
     * @param address The UpdateAddressRequest containing the updated details for the address.
     * @return the updated Address DTO.
     */
    Address updateAddress(Long id, UpdateAddressRequest address);

    /**
     * Deletes an address identified by its unique identifier.
     *
     * @param id The ID of the address to delete.
     */
    void deleteAddress(Long id);

    /**
     * Deletes all addresses associated with a specific user ID.
     *
     * @param userId The ID of the user whose addresses to delete.
     */
    void deleteAddressesByUserId(Long userId);
}


package es.jose.backend.services;

import es.jose.backend.exceptions.resource.ResourceNotFoundException;
import es.jose.backend.mappers.AddressMapper;
import es.jose.backend.persistence.entities.AddressEntity;
import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.repositories.AddressRepository;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddAddressRequest;
import org.openapitools.model.Address;
import org.openapitools.model.AddressTypeEnum;
import org.openapitools.model.UpdateAddressRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for managing addresses. Provides methods for retrieving, creating,
 * updating, and deleting address information and interacts with the AddressRepository and
 * UserService.
 */
@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressMapper addressMapper;
    private final AddressRepository addressRepository;
    private final UserService userService;

    /**
     * Retrieves a list of all addresses in the system.
     *
     * @return a list of Address DTOs.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Address> getAllAddresses() {
        return addressRepository.findAll().stream()
                .map(addressMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a list of addresses associated with a specific user ID.
     *
     * @param userId The ID of the user whose addresses to retrieve.
     * @return a list of Address DTOs for the given user ID.
     * @throws ResourceNotFoundException if the user with the given ID is not found.
     */
    @Override
    @Transactional(readOnly = true)
    public List<Address> getAddressesByUserId(Long userId) {
        // Check if user exists
        userService.getUserById(userId);

        return addressRepository.findByUserId(userId).stream()
                .map(addressMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves a specific address by its unique identifier.
     *
     * @param id The ID of the address to retrieve.
     * @return the Address DTO corresponding to the given ID.
     * @throws ResourceNotFoundException if no address is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public Address getAddressById(Long id) {
        return addressRepository
                .findById(id)
                .map(addressMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id.toString()));
    }

    /**
     * Retrieves a specific Address entity by its unique identifier.
     *
     * @param id The ID of the address entity to retrieve.
     * @return the AddressEntity corresponding to the given ID.
     * @throws ResourceNotFoundException if no address entity is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public AddressEntity getAddressEntityById(Long id) {
        return addressRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id.toString()));
    }

    /**
     * Retrieves an address for a specific user by their ID and address type.
     *
     * @param userId The ID of the user.
     * @param addressType The type of address (e.g., SHIPPING, BILLING).
     * @return an Optional containing the Address DTO if found, otherwise empty.
     * @throws ResourceNotFoundException if the user with the given ID is not found.
     */
    @Override
    @Transactional(readOnly = true)
    public Optional<Address> getAddressByUserIdAndType(Long userId, AddressTypeEnum addressType) {
        // Check if user exists
        userService.getUserById(userId);

        return addressRepository
                .findByUserIdAndAddressType(userId, addressType)
                .map(addressMapper::toDto);
    }

    /**
     * Creates a new address. Retrieves the associated user entity and sets it in the address entity
     * before saving.
     *
     * @param address The AddAddressRequest containing the details for the new address.
     * @return the created Address DTO.
     * @throws ResourceNotFoundException if the user specified in the request is not found.
     */
    @Override
    @Transactional
    public Address createAddress(AddAddressRequest address) {
        // Get user entity to set in the address
        UserEntity user = userService.getUserEntityById(address.userId());

        AddressEntity addressEntity = addressMapper.toEntity(address);
        addressEntity.setUser(user);

        return addressMapper.toDto(addressRepository.save(addressEntity));
    }

    /**
     * Updates an existing address identified by its unique identifier. Maps the update request to
     * the existing entity and saves the changes.
     *
     * @param id The ID of the address to update.
     * @param address The UpdateAddressRequest containing the updated details for the address.
     * @return the updated Address DTO.
     * @throws ResourceNotFoundException if no address is found with the given ID.
     */
    @Override
    @Transactional
    public Address updateAddress(Long id, UpdateAddressRequest address) {
        return addressRepository
                .findById(id)
                .map(
                        entity -> {
                            addressMapper.updateEntity(address, entity);
                            return entity;
                        })
                .map(addressRepository::save)
                .map(addressMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", id.toString()));
    }

    /**
     * Deletes an address identified by its unique identifier.
     *
     * @param id The ID of the address to delete.
     * @throws ResourceNotFoundException if no address is found with the given ID.
     */
    @Override
    @Transactional
    public void deleteAddress(Long id) {
        if (addressRepository.existsById(id)) {
            addressRepository.deleteById(id);
        } else {
            throw new ResourceNotFoundException("Address", "id", id.toString());
        }
    }

    /**
     * Deletes all addresses associated with a specific user ID. Retrieves the user entity and
     * deletes addresses linked to that user.
     *
     * @param userId The ID of the user whose addresses to delete.
     * @throws ResourceNotFoundException if the user with the given ID is not found.
     */
    @Override
    @Transactional
    public void deleteAddressesByUserId(Long userId) {
        // Check if user exists
        UserEntity user = userService.getUserEntityById(userId);

        addressRepository.deleteByUser(user);
    }
}


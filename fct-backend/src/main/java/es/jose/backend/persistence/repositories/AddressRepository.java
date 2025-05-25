package es.jose.backend.persistence.repositories;

import es.jose.backend.persistence.entities.AddressEntity;
import es.jose.backend.persistence.entities.UserEntity;
import org.openapitools.model.AddressTypeEnum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<AddressEntity, Long> {

    /**
     * Find all addresses for a specific user
     * 
     * @param user The user entity
     * @return List of addresses associated with the user
     */
    List<AddressEntity> findByUser(UserEntity user);

    /**
     * Find all addresses for a user by userId
     * 
     * @param userId The user ID
     * @return List of addresses associated with the userId
     */
    List<AddressEntity> findByUserId(Long userId);

    /**
     * Find the address with a specific type for a user
     * 
     * @param user        The user entity
     * @param addressType The address type
     * @return Optional containing the address if found
     */
    Optional<AddressEntity> findByUserAndAddressType(UserEntity user, AddressTypeEnum addressType);

    /**
     * Find the address with a specific type for a user by userId
     * 
     * @param userId      The user ID
     * @param addressType The address type
     * @return Optional containing the address if found
     */
    Optional<AddressEntity> findByUserIdAndAddressType(Long userId, AddressTypeEnum addressType);

    /**
     * Check if a user has any addresses
     * 
     * @param userId The user ID
     * @return true if the user has at least one address
     */
    boolean existsByUserId(Long userId);

    /**
     * Delete all addresses for a specific user
     * 
     * @param user The user entity
     */
    void deleteByUser(UserEntity user);
}

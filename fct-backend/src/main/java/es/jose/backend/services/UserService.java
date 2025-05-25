package es.jose.backend.services;

import es.jose.backend.persistence.entities.UserEntity;

import org.openapitools.model.AddUserRequest;
import org.openapitools.model.RegisterRequest;
import org.openapitools.model.RoleEnum;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for managing user accounts. Provides methods for retrieving, creating,
 * updating, and deleting users, as well as user activation and retrieval by various identifiers.
 */
public interface UserService {

    /**
     * Retrieves a list of all users, optionally filtered by username or email.
     *
     * @param usernameOrEmail An optional string to filter users by username or email.
     * @return A list of User DTOs.
     */
    List<User> getAllUsers(Optional<String> usernameOrEmail);

    /**
     * Retrieves a specific user by their unique identifier.
     *
     * @param id The ID of the user to retrieve.
     * @return The User DTO corresponding to the given ID.
     */
    User getUserById(Long id);

    /**
     * Retrieves a specific User entity by its unique identifier.
     *
     * @param id The ID of the user entity to retrieve.
     * @return The UserEntity corresponding to the given ID.
     */
    UserEntity getUserEntityById(Long id);

    /**
     * Retrieves a specific user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return The User DTO corresponding to the given username.
     */
    User getUserByUsername(String username);

    /**
     * Retrieves a specific user by their email address.
     *
     * @param email The email address of the user to retrieve.
     * @return The User DTO corresponding to the given email address.
     */
    User getUserByEmail(String email);

    /**
     * Retrieves a specific user by either their username or email address.
     *
     * @param usernameOrEmail The username or email address of the user to retrieve.
     * @return The User DTO corresponding to the given username or email address.
     */
    User getUserByUsernameOrEmail(String usernameOrEmail);

    /**
     * Creates a new user based on the provided request.
     *
     * @param user The AddUserRequest containing the details for the new user.
     * @return The newly created User DTO.
     */
    User createUser(AddUserRequest user);

    /**
     * Creates a new user from a registration request. Defaults the role to USER.
     *
     * @param user The RegisterRequest containing the registration details.
     * @return The newly created User DTO.
     */
    default User createUser(RegisterRequest user) {
        return createUser(
                AddUserRequest.builder()
                        .username(user.username())
                        .email(user.email())
                        .password(user.password())
                        .firstName(user.firstName())
                        .lastName(user.lastName())
                        .role(RoleEnum.USER)
                        .build());
    }
    ;

    /**
     * Updates an existing user identified by their unique identifier.
     *
     * @param id The ID of the user to update.
     * @param user The UpdateUserRequest containing the updated details for the user.
     * @return The updated User DTO.
     */
    User updateUser(Long id, UpdateUserRequest user);

    /**
     * Deletes a user identified by their unique identifier.
     *
     * @param id The ID of the user to delete.
     */
    void deleteUser(Long id);

    /**
     * Activates a user account identified by its unique identifier.
     *
     * @param id The ID of the user to activate.
     * @return The activated User DTO.
     */
    User activateUserById(Long id);
}

package es.jose.backend.services;

import es.jose.backend.exceptions.user.UserAlreadyExistsException;
import es.jose.backend.exceptions.user.UserNotFoundException;
import es.jose.backend.mappers.UserMapper;
import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import org.openapitools.model.AddUserRequest;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service implementation for managing user accounts. Provides methods for retrieving, creating,
 * updating, and deleting users, as well as user activation and retrieval by various identifiers.
 * Interacts with the UserRepository, UserMapper, and PasswordEncoder.
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Retrieves a list of all users, optionally filtered by username or email.
     *
     * @param usernameOrEmail An optional string to filter users by username or email.
     * @return A list of User DTOs.
     */
    @Override
    @Transactional(readOnly = true)
    public List<User> getAllUsers(Optional<String> usernameOrEmail) {
        return usernameOrEmail
                .flatMap(userRepository::findByUsernameOrEmail)
                .map(userMapper::toDto)
                .map(Collections::singletonList)
                .orElseGet(
                        () ->
                                userRepository.findAll().stream()
                                        .map(userMapper::toDto)
                                        .collect(Collectors.toList()));
    }

    /**
     * Retrieves a specific user by their unique identifier.
     *
     * @param id The ID of the user to retrieve.
     * @return The User DTO corresponding to the given ID.
     * @throws UserNotFoundException if no user is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public User getUserById(Long id) {
        return userRepository
                .findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    /**
     * Retrieves a specific User entity by its unique identifier.
     *
     * @param id The ID of the user entity to retrieve.
     * @return The UserEntity corresponding to the given ID.
     * @throws UserNotFoundException if no user entity is found with the given ID.
     */
    @Override
    @Transactional(readOnly = true)
    public UserEntity getUserEntityById(Long id) {
        return userRepository
                .findById(id)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    /**
     * Retrieves a specific user by their username.
     *
     * @param username The username of the user to retrieve.
     * @return The User DTO corresponding to the given username.
     * @throws UserNotFoundException if no user is found with the given username.
     */
    @Override
    @Transactional(readOnly = true)
    public User getUserByUsername(String username) {
        return userRepository
                .findByUsername(username)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("username", username));
    }

    /**
     * Retrieves a specific user by their email address.
     *
     * @param email The email address of the user to retrieve.
     * @return The User DTO corresponding to the given email address.
     * @throws UserNotFoundException if no user is found with the given email address.
     */
    @Override
    @Transactional(readOnly = true)
    public User getUserByEmail(String email) {
        return userRepository
                .findByEmail(email)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("email", email));
    }

    /**
     * Retrieves a specific user by either their username or email address.
     *
     * @param usernameOrEmail The username or email address of the user to retrieve.
     * @return The User DTO corresponding to the given username or email address.
     * @throws UserNotFoundException if no user is found with the given username or email address.
     */
    @Override
    @Transactional(readOnly = true)
    public User getUserByUsernameOrEmail(String usernameOrEmail) {
        return userRepository
                .findByUsernameOrEmail(usernameOrEmail)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("Username or email", usernameOrEmail));
    }

    /**
     * Creates a new user based on the provided request. Encrypts the password before saving the
     * user entity.
     *
     * @param user The AddUserRequest containing the details for the new user.
     * @return The newly created User DTO.
     * @throws UserAlreadyExistsException if a user with the same email or username already exists.
     */
    @Override
    @Transactional
    public User createUser(AddUserRequest user) {
        return Optional.of(user)
                .filter(this::isUserUnique)
                .map(userMapper::toEntity)
                .map(this::encryptPassword)
                .map(userRepository::save)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserAlreadyExistsException("email or username"));
    }

    /**
     * Updates an existing user identified by their unique identifier.
     *
     * @param id The ID of the user to update.
     * @param user The UpdateUserRequest containing the updated details for the user.
     * @return The updated User DTO.
     * @throws UserNotFoundException if no user is found with the given ID.
     */
    @Override
    @Transactional
    public User updateUser(Long id, UpdateUserRequest user) {
        return userRepository
                .findById(id)
                .map(
                        u -> {
                            userMapper.updateEntity(user, u);
                            return u;
                        })
                .map(userRepository::save)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    /**
     * Deletes a user identified by their unique identifier.
     *
     * @param id The ID of the user to delete.
     * @throws UserNotFoundException if no user is found with the given ID.
     */
    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) userRepository.deleteById(id);
        else throw new UserNotFoundException("id", id.toString());
    }

    /**
     * Activates a user account identified by its unique identifier. Sets the isActive flag to true
     * and saves the changes.
     *
     * @param id The ID of the user to activate.
     * @return The activated User DTO.
     * @throws UserNotFoundException if no user is found with the given ID.
     */
    @Override
    @Transactional
    public User activateUserById(Long id) {
        return userRepository
                .findById(id)
                .map(
                        u -> {
                            u.setIsActive(true);
                            return u;
                        })
                .map(userRepository::save)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    /**
     * Checks if a user with the given email or username already exists.
     *
     * @param user The AddUserRequest containing the email and username to check.
     * @return true if the email and username are unique, false otherwise.
     */
    private boolean isUserUnique(AddUserRequest user) {
        return !userRepository.existsByEmailOrUsername(user.email(), user.username());
    }

    /**
     * Encrypts the user's password using the configured PasswordEncoder.
     *
     * @param user The UserEntity whose password needs to be encrypted.
     * @return The UserEntity with the encrypted password.
     */
    private UserEntity encryptPassword(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return user;
    }
}

package es.jose.backend.services;

import java.util.List;
import java.util.Optional;

import org.openapitools.model.AddUserRequest;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import es.jose.backend.exceptions.user.UserAlreadyExistsException;
import es.jose.backend.exceptions.user.UserNotFoundException;
import es.jose.backend.mappers.UserMapper;
import es.jose.backend.persistence.entities.UserEntity;
import es.jose.backend.persistence.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .toList();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("username", username));
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("email", email));
    }

    @Override
    public UserEntity getUserEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    @Override
    public User createUser(AddUserRequest user) {
        return Optional.of(user)
                .filter(this::isUserUnique)
                .map(userMapper::toEntity)
                .map(this::encryptPassword)
                .map(userRepository::save)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserAlreadyExistsException("email or username",
                        "%s or %s".formatted(user.email(), user.username())));
    }

    @Override
    public User updateUser(Long id, UpdateUserRequest user) {
        return userRepository.findById(id)
                .map(u -> {
                    userMapper.updateEntity(user, u);
                    return userRepository.save(u);
                })
                .map(userRepository::save)
                .map(userMapper::toDto)
                .orElseThrow(() -> new UserNotFoundException("id", id.toString()));
    }

    @Override
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return;
        }
        throw new UserNotFoundException("id", id.toString());
    }

    private boolean isUserUnique(AddUserRequest user) {
        return userRepository.findByEmail(user.email()).isEmpty()
                && userRepository.findByUsername(user.username()).isEmpty();
    }

    private UserEntity encryptPassword(UserEntity user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return user;
    }
}

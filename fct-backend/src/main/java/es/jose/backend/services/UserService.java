package es.jose.backend.services;

import java.util.List;

import org.openapitools.model.AddUserRequest;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;

import es.jose.backend.persistence.entities.UserEntity;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    UserEntity getUserEntityById(Long id);

    User getUserByUsername(String username);

    User getUserByEmail(String email);

    User createUser(AddUserRequest user);

    User updateUser(Long id, UpdateUserRequest user);

    void deleteUser(Long id);

}

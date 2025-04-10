package es.jose.backend.services;

import java.util.List;

import org.openapitools.model.AddUserRequest;
import org.openapitools.model.RegisterRequest;
import org.openapitools.model.RoleEnum;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;

import es.jose.backend.persistence.entities.UserEntity;

public interface UserService {

    List<User> getAllUsers();

    User getUserById(Long id);

    UserEntity getUserEntityById(Long id);

    User getUserByUsername(String username);

    User getUserByEmail(String email);

    User getUserByUsernameOrEmail(String usernameOrEmail);

    User createUser(AddUserRequest user);

    default User createUser(RegisterRequest user) {
        return createUser(AddUserRequest.builder()
                .username(user.username())
                .email(user.email())
                .password(user.password())
                .firstName(user.firstName())
                .lastName(user.lastName())
                .role(RoleEnum.USER)
                .build());
    };

    User updateUser(Long id, UpdateUserRequest user);

    void deleteUser(Long id);

}

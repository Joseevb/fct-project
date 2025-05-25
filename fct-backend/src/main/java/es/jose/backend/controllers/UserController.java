package es.jose.backend.controllers;

import es.jose.backend.services.UserService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.UsersApi;
import org.openapitools.model.AddUserRequest;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class UserController implements UsersApi {

    private final UserService userService;

    @Override
    public ResponseEntity<List<User>> getAllUsers(@Valid Optional<String> usernameOrEmail) {
        return ResponseEntity.ok(userService.getAllUsers(usernameOrEmail));
    }

    @Override
    public ResponseEntity<User> getUserById(Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Override
    public ResponseEntity<User> addUser(@Valid final AddUserRequest addUserRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createUser(addUserRequest));
    }

    @Override
    public ResponseEntity<Void> deleteUser(Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<User> updateUser(Long id, @Valid UpdateUserRequest updateUserRequest) {
        return ResponseEntity.ok(userService.updateUser(id, updateUserRequest));
    }
}

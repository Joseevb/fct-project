package es.jose.backend.controllers;

import java.util.List;

import org.openapitools.api.UserApi;
import org.openapitools.model.AddUserRequest;
import org.openapitools.model.UpdateUserRequest;
import org.openapitools.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import es.jose.backend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class UserController implements UserApi {

    private final UserService userService;

    @Override
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @Override
    public ResponseEntity<User> getUserById(Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Override
    public ResponseEntity<User> addUser(@Valid final AddUserRequest addUserRequest) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
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

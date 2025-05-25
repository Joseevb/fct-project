package es.jose.backend.controllers;

import es.jose.backend.services.StorageService;

import lombok.RequiredArgsConstructor;

import org.openapitools.api.FilesApi;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.NativeWebRequest;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
public class FilesController implements FilesApi {

    private final NativeWebRequest request;
    private final StorageService storageService;

    @Override
    public ResponseEntity<Resource> downloadFile(String name) {
        return ResponseEntity.ok(storageService.loadFileAsResource(name));
    }

    @Override
    public Optional<NativeWebRequest> getRequest() {
        return Optional.ofNullable(request);
    }
}

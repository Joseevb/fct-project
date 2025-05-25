package es.jose.backend.services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for handling file storage operations. Provides methods for storing, loading,
 * and deleting files.
 */
public interface StorageService {
    /**
     * Stores a file in the storage service.
     *
     * @param file The file to store.
     * @return The unique name of the stored file.
     */
    String storeFile(MultipartFile file);

    /**
     * Loads a file from the storage service.
     *
     * @param filename The name of the file to load.
     * @return The loaded file as a resource.
     */
    Resource loadFileAsResource(String filename);

    /**
     * Deletes a file from the storage service.
     *
     * @param filename The name of the file to delete.
     * @return True if the file was deleted, false if it was not found.
     */
    boolean deleteFile(String filename);
}

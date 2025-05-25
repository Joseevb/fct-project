package es.jose.backend.services;

import jakarta.annotation.PostConstruct;

import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Service implementation for handling file storage operations. Stores files locally on the
 * filesystem. Provides methods for storing, loading, and deleting files.
 */
@Slf4j
@Service
public class StorageServiceImpl implements StorageService {

    /** The root location on the filesystem where files will be stored. */
    @Value("${app.file-storage}")
    private Path rootLocation;

    /**
     * Initializes the storage directory upon service creation. Creates the directory if it doesn't
     * exist.
     *
     * @throws RuntimeException if the storage directory cannot be initialized.
     */
    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(rootLocation)) {
                Files.createDirectories(rootLocation);
                log.info("Created storage directory: {}", rootLocation);
            } else {
                log.info("Storage directory already exists: {}", rootLocation);
            }
        } catch (IOException e) {
            log.error("Could not initialize storage location: {}", this.rootLocation, e);
            throw new RuntimeException(
                    "Could not initialize storage location: " + this.rootLocation, e);
        }
    }

    /**
     * Stores a file in the configured storage directory. Generates a unique filename using UUID.
     * Handles files without original names and prevents path traversal issues.
     *
     * @param file The MultipartFile to store.
     * @return The unique name assigned to the stored file.
     * @throws IllegalArgumentException if the file is null or empty, or if the filename contains
     *     invalid path sequences.
     * @throws SecurityException if the target location is outside the designated storage directory.
     * @throws RuntimeException if there is an I/O error during storage.
     */
    public String storeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            log.warn("Attempted to store an empty or null file.");
            throw new IllegalArgumentException("Failed to store empty or null file.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
        if (!StringUtils.hasText(originalFilename)) {
            // Handle files without a name - e.g. assign a generic one or reject
            originalFilename = "unnamedfile_" + UUID.randomUUID().toString();
            log.warn("Uploaded file has no original name, assigned: {}", originalFilename);
        }

        if (originalFilename.contains("..")) {
            log.error("Attempt to store file with invalid path sequence: {}", originalFilename);
            throw new IllegalArgumentException(
                    "Cannot store file with relative path outside current directory: "
                            + originalFilename);
        }

        try {
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }

            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;
            Path targetLocation = this.rootLocation.resolve(uniqueFileName).normalize();

            if (!targetLocation.getParent().equals(this.rootLocation)) {
                log.error(
                        "Attempt to store file outside designated storage directory. Target: {},"
                                + " Root: {}",
                        targetLocation,
                        this.rootLocation);
                throw new SecurityException(
                        "Cannot store file outside designated storage directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
                log.info(
                        "Stored file '{}' as '{}' at: {}",
                        originalFilename,
                        uniqueFileName,
                        targetLocation);
            }
            return uniqueFileName;

        } catch (IOException e) {
            log.error("Failed to store file {}: {}", originalFilename, e.getMessage(), e);
            throw new RuntimeException("Failed to store file " + originalFilename, e);
        }
    }

    /**
     * Loads a file from the storage service as a Spring Resource. Normalizes the path and prevents
     * accessing files outside the storage root.
     *
     * <p>For files under src/main/resources/files (packaged in the classpath), this method tries to
     * load them from the classpath first. If not found, it tries to load from the filesystem
     * storage root.
     *
     * @param filename The name of the file to load.
     * @return The loaded file as a Resource.
     * @throws IllegalArgumentException if the filename is null or empty.
     * @throws SecurityException if attempting to access a file outside the storage root.
     * @throws RuntimeException if the file is not found or readable, or due to a malformed URL.
     */
    public Resource loadFileAsResource(String filename) {
        if (!StringUtils.hasText(filename)) {
            throw new IllegalArgumentException("Filename cannot be null or empty.");
        }

        try {
            // First try loading from classpath (resources)
            ClassPathResource classPathResource = new ClassPathResource("files/" + filename);
            if (classPathResource.exists() && classPathResource.isReadable()) {
                log.debug("Loaded file '{}' from classpath 'files/' folder.", filename);
                return classPathResource;
            }

            // Fallback: try loading from filesystem rootLocation
            Path filePath = rootLocation.resolve(filename).normalize();
            log.debug(
                    "Classpath load failed; attempting to load file from filesystem: {}", filePath);

            if (!filePath.startsWith(this.rootLocation)) {
                log.error(
                        "Attempt to access file outside storage root: {} (resolved from filename:"
                            + " {})",
                        filePath,
                        filename);
                throw new SecurityException("Cannot access file outside storage root: " + filename);
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                log.warn("File not found or not readable at path: {}", filePath);
                throw new FileNotFoundException(
                        "Could not read file: " + filename + " at path " + filePath);
            }
        } catch (MalformedURLException e) {
            log.error(
                    "Malformed URL for file {} (path {}): {}",
                    filename,
                    rootLocation.resolve(filename).normalize(),
                    e.getMessage(),
                    e);
            throw new RuntimeException("Could not read file due to malformed URL: " + filename, e);
        } catch (IOException e) {
            throw new RuntimeException("File not found: " + filename, e);
        }
    }

    /**
     * Deletes a file from the storage service. Normalizes the path and prevents deleting files
     * outside the storage root.
     *
     * @param filename The name of the file to delete.
     * @return True if the file was deleted, false if it was not found.
     * @throws IllegalArgumentException if the filename is null or empty.
     * @throws SecurityException if attempting to delete a file outside the storage root.
     * @throws RuntimeException if there is an I/O error during deletion.
     */
    public boolean deleteFile(String filename) {
        if (!StringUtils.hasText(filename)) {
            throw new IllegalArgumentException("Filename cannot be null or empty for deletion.");
        }
        try {
            Path filePath = rootLocation.resolve(filename).normalize();
            log.debug("Attempting to delete file from: {}", filePath);

            if (!filePath.startsWith(this.rootLocation)) {
                log.error(
                        "Attempt to delete file outside storage root: {} (resolved from filename:"
                            + " {})",
                        filePath,
                        filename);
                throw new SecurityException("Cannot delete file outside storage root: " + filename);
            }

            // Using Files.deleteIfExists to avoid an exception if the file is already gone
            boolean deleted = Files.deleteIfExists(filePath);
            if (deleted) {
                log.info("Deleted file: {}", filePath);
            } else {
                log.warn("File not found for deletion or was already deleted: {}", filePath);
            }
            return deleted;

        } catch (IOException e) {
            log.error("Could not delete file {}: {}", filename, e.getMessage(), e);
            throw new RuntimeException("Could not delete file: " + filename, e);
        }
    }
}

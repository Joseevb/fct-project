package es.jose.backend.mappers.util;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

/*
 * Utility methods commonly used across different MapStruct mappers.
 */
public interface MapperUtils {

    /**
     * Unwraps an Optional to its value, returning null if the Optional is empty. MapStruct can
     * automatically use this method when mapping from Optional<T> to T if this interface is
     * declared in the @Mapper's 'uses' attribute.
     *
     * @param <T> the type of the value
     * @param optional the Optional source value
     * @return the unwrapped value or null if empty
     */
    default <T> T unwrapOptional(Optional<T> optional) {
        return optional.orElse(null);
    }

    /**
     * Maps a LocalDateTime to an OffsetDateTime, setting the time zone to UTC.
     *
     * @param dateTime the LocalDateTime to map
     * @return the mapped OffsetDateTime
     */
    default OffsetDateTime map(LocalDateTime dateTime) {
        return dateTime.atOffset(ZoneOffset.UTC);
    }
}

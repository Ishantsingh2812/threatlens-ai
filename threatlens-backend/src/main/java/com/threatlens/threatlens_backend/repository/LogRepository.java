package com.threatlens.threatlens_backend.repository;


import com.threatlens.threatlens_backend.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LogRepository extends JpaRepository<Log, Long> {

    List<Log> findByIpAddressAndEndpointAndStatusCodeAndTimestampAfter(
            String ipAddress,
            String endpoint,
            Integer statusCode,
            LocalDateTime timestamp
    );

    List<Log> findByIpAddressAndStatusCodeAndTimestampAfter(
            String ipAddress,
            Integer statusCode,
            LocalDateTime timestamp
    );

    List<Log> findByUsernameAndStatusCodeAndTimestampAfter(
            String username,
            Integer statusCode,
            LocalDateTime timestamp
    );

    List<Log> findByIpAddressAndTimestampAfter(
            String ipAddress,
            LocalDateTime timestamp
    );
}

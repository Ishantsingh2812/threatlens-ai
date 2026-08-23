package com.threatlens.threatlens_backend.detection;



import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.entity.Severity;
import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.entity.ThreatStatus;
import com.threatlens.threatlens_backend.entity.ThreatType;
import com.threatlens.threatlens_backend.repository.LogRepository;
import com.threatlens.threatlens_backend.repository.ThreatRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class BruteForceRule implements ThreatRule {

    private static final int FAILED_ATTEMPT_THRESHOLD = 5;
    private static final int TIME_WINDOW_SECONDS = 60;

    private final LogRepository logRepository;
    private final ThreatRepository threatRepository;

    public BruteForceRule(LogRepository logRepository , ThreatRepository threatRepository) {
        this.logRepository = logRepository;
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        if (!isFailedLogin(log)) {
            return null;
        }

        // Check whether this IP already has an open brute-force threat
        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.BRUTE_FORCE,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        LocalDateTime windowStart =
                log.getTimestamp().minusSeconds(TIME_WINDOW_SECONDS);

        List<Log> failedAttempts =
                logRepository
                        .findByIpAddressAndEndpointAndStatusCodeAndTimestampAfter(
                                log.getIpAddress(),
                                "/api/login",
                                401,
                                windowStart
                        );

        if (failedAttempts.size() < FAILED_ATTEMPT_THRESHOLD) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.BRUTE_FORCE);
        threat.setSeverity(Severity.CRITICAL);

        threat.setDescription(
                "Multiple failed login attempts detected from "
                        + log.getIpAddress()
        );

        threat.setSourceIp(log.getIpAddress());
        threat.setUsername(log.getUsername());
        threat.setDetectedAt(LocalDateTime.now());
        threat.setStatus(ThreatStatus.OPEN);
        threat.setLog(log);

        return threat;
    }

    private boolean isFailedLogin(Log log) {

        return "/api/login".equals(log.getEndpoint())
                && log.getStatusCode() != null
                && log.getStatusCode() == 401;
    }
}
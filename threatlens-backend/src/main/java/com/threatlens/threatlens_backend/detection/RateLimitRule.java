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
public class RateLimitRule implements ThreatRule {

    private static final int REQUEST_THRESHOLD = 30;
    private static final int TIME_WINDOW_SECONDS = 60;

    private final LogRepository logRepository;
    private final ThreatRepository threatRepository;

    public RateLimitRule(
            LogRepository logRepository,
            ThreatRepository threatRepository
    ) {
        this.logRepository = logRepository;
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        if (log.getIpAddress() == null
                || log.getTimestamp() == null) {
            return null;
        }

        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.RATE_LIMIT_VIOLATION,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        LocalDateTime windowStart =
                log.getTimestamp().minusSeconds(TIME_WINDOW_SECONDS);

        List<Log> recentRequests =
                logRepository.findByIpAddressAndTimestampAfter(
                        log.getIpAddress(),
                        windowStart
                );

        System.out.println(
                "RATE LIMIT CHECK: "
                        + recentRequests.size()
                        + " requests from "
                        + log.getIpAddress()
        );

        if (recentRequests.size() < REQUEST_THRESHOLD) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.RATE_LIMIT_VIOLATION);
        threat.setSeverity(Severity.MEDIUM);

        threat.setDescription(
                "High request rate detected from "
                        + log.getIpAddress()
                        + " - "
                        + recentRequests.size()
                        + " requests within "
                        + TIME_WINDOW_SECONDS
                        + " seconds"
        );

        threat.setSourceIp(log.getIpAddress());
        threat.setUsername(log.getUsername());
        threat.setDetectedAt(LocalDateTime.now());
        threat.setStatus(ThreatStatus.OPEN);
        threat.setLog(log);

        return threat;
    }
}

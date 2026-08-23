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
public class NotFoundScanRule implements ThreatRule {

    private static final int NOT_FOUND_THRESHOLD = 10;
    private static final int TIME_WINDOW_SECONDS = 60;

    private final LogRepository logRepository;
    private final ThreatRepository threatRepository;

    public NotFoundScanRule(
            LogRepository logRepository,
            ThreatRepository threatRepository
    ) {
        this.logRepository = logRepository;
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        if (!isNotFound(log)) {
            return null;
        }

        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.NOT_FOUND_SCAN,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        LocalDateTime windowStart =
                log.getTimestamp().minusSeconds(TIME_WINDOW_SECONDS);

        List<Log> notFoundRequests =
                logRepository.findByIpAddressAndStatusCodeAndTimestampAfter(
                        log.getIpAddress(),
                        404,
                        windowStart
                );

        System.out.println(
                "404 SCAN CHECK: "
                        + notFoundRequests.size()
                        + " requests from "
                        + log.getIpAddress()
        );

        if (notFoundRequests.size() < NOT_FOUND_THRESHOLD) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.NOT_FOUND_SCAN);
        threat.setSeverity(Severity.MEDIUM);

        threat.setDescription(
                "Repeated 404 requests detected from "
                        + log.getIpAddress()
        );

        threat.setSourceIp(log.getIpAddress());
        threat.setUsername(log.getUsername());
        threat.setDetectedAt(LocalDateTime.now());
        threat.setStatus(ThreatStatus.OPEN);
        threat.setLog(log);

        return threat;
    }

    private boolean isNotFound(Log log) {

        return log.getStatusCode() != null
                && log.getStatusCode() == 404;
    }
}

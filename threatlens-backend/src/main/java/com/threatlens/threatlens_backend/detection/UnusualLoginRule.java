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
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class UnusualLoginRule implements ThreatRule {

    private static final int TIME_WINDOW_MINUTES = 15;
    private static final int DIFFERENT_IP_THRESHOLD = 2;

    private final LogRepository logRepository;
    private final ThreatRepository threatRepository;

    public UnusualLoginRule(
            LogRepository logRepository,
            ThreatRepository threatRepository
    ) {
        this.logRepository = logRepository;
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        if (!isSuccessfulLogin(log)) {
            return null;
        }

        if (log.getUsername() == null
                || log.getUsername().isBlank()) {
            return null;
        }

        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.UNUSUAL_LOGIN,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        LocalDateTime windowStart =
                log.getTimestamp().minusMinutes(TIME_WINDOW_MINUTES);

        List<Log> recentLogins =
                logRepository.findByUsernameAndStatusCodeAndTimestampAfter(
                        log.getUsername(),
                        200,
                        windowStart
                );

        Set<String> uniqueIps = new HashSet<>();

        for (Log login : recentLogins) {
            if (login.getIpAddress() != null) {
                uniqueIps.add(login.getIpAddress());
            }
        }

        // Include current login
        if (log.getIpAddress() != null) {
            uniqueIps.add(log.getIpAddress());
        }

        System.out.println(
                "LOGIN ANOMALY CHECK: user="
                        + log.getUsername()
                        + " | unique IPs="
                        + uniqueIps.size()
        );

        if (uniqueIps.size() < DIFFERENT_IP_THRESHOLD) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.UNUSUAL_LOGIN);
        threat.setSeverity(Severity.HIGH);

        threat.setDescription(
                "User "
                        + log.getUsername()
                        + " logged in from multiple IP addresses within "
                        + TIME_WINDOW_MINUTES
                        + " minutes"
        );

        threat.setSourceIp(log.getIpAddress());
        threat.setUsername(log.getUsername());
        threat.setDetectedAt(LocalDateTime.now());
        threat.setStatus(ThreatStatus.OPEN);
        threat.setLog(log);

        return threat;
    }

    private boolean isSuccessfulLogin(Log log) {

        return "/api/login".equals(log.getEndpoint())
                && log.getStatusCode() != null
                && log.getStatusCode() == 200;
    }
}

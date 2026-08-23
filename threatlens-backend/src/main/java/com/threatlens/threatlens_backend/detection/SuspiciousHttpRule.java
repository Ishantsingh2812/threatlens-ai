package com.threatlens.threatlens_backend.detection;


import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.entity.Severity;
import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.entity.ThreatStatus;
import com.threatlens.threatlens_backend.entity.ThreatType;
import com.threatlens.threatlens_backend.repository.ThreatRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Locale;

@Component
public class SuspiciousHttpRule implements ThreatRule {

    private final ThreatRepository threatRepository;

    private static final int THRESHOLD = 3;

    public SuspiciousHttpRule(ThreatRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        int score = calculateRiskScore(log);

        System.out.println(
                "HTTP RISK SCORE: "
                        + score
                        + " | "
                        + log.getEndpoint()
        );

        if (score < THRESHOLD) {
            return null;
        }

        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.SUSPICIOUS_HTTP,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.SUSPICIOUS_HTTP);
        threat.setSeverity(calculateSeverity(score));

        threat.setDescription(
                "Suspicious HTTP request detected with risk score "
                        + score
        );

        threat.setSourceIp(log.getIpAddress());
        threat.setUsername(log.getUsername());
        threat.setDetectedAt(LocalDateTime.now());
        threat.setStatus(ThreatStatus.OPEN);
        threat.setLog(log);

        return threat;
    }

    private int calculateRiskScore(Log log) {

        int score = 0;

        String endpoint = safe(log.getEndpoint()).toLowerCase(Locale.ROOT);
        String method = safe(log.getMethod()).toUpperCase(Locale.ROOT);
        String userAgent = safe(log.getUserAgent()).toLowerCase(Locale.ROOT);

        // 1. Dangerous/unusual HTTP methods
        if (method.equals("TRACE") || method.equals("CONNECT")) {
            score += 2;
        }

        // 2. Sensitive endpoints
        if (endpoint.contains("/admin")
                || endpoint.contains("/actuator")
                || endpoint.contains("/.env")
                || endpoint.contains("/config")
                || endpoint.contains("/wp-admin")
                || endpoint.contains("/phpmyadmin")) {

            score += 2;
        }

        // 3. Suspicious user agents
        if (userAgent.contains("sqlmap")
                || userAgent.contains("nikto")
                || userAgent.contains("nmap")
                || userAgent.contains("masscan")
                || userAgent.contains("scanner")
                || userAgent.contains("curl")) {

            score += 2;
        }

        // 4. Very long URL
        if (endpoint.length() > 500) {
            score += 1;
        }

        // 5. Suspicious HTTP status
        if (log.getStatusCode() != null
                && (log.getStatusCode() == 403
                || log.getStatusCode() == 405
                || log.getStatusCode() == 500)) {

            score += 1;
        }

        // 6. Directory traversal
        if (endpoint.contains("../")
                || endpoint.contains("..\\")) {

            score += 2;
        }

        return score;
    }

    private Severity calculateSeverity(int score) {

        if (score >= 5) {
            return Severity.CRITICAL;
        }

        if (score >= 4) {
            return Severity.HIGH;
        }

        return Severity.MEDIUM;
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}

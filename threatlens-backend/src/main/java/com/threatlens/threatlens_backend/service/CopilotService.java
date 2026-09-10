package com.threatlens.threatlens_backend.service;

import com.threatlens.threatlens_backend.entity.Severity;
import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.repository.LogRepository;
import com.threatlens.threatlens_backend.repository.ThreatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CopilotService {

    private final ThreatRepository threatRepository;
    private final LogRepository logRepository;

    public CopilotService(
            ThreatRepository threatRepository,
            LogRepository logRepository
    ) {
        this.threatRepository = threatRepository;
        this.logRepository = logRepository;
    }

    public String generateResponse(String message) {

        if (message == null || message.isBlank()) {
            return "Please ask me a security-related question.";
        }

        String question = message.toLowerCase();

        long totalThreats = threatRepository.count();
        long critical = threatRepository.countBySeverity(Severity.CRITICAL);

        if (question.contains("how many") &&
                question.contains("threat")) {

            return "ThreatLens currently has "
                    + totalThreats
                    + " detected threats, including "
                    + critical
                    + " critical threats.";
        }

        if (question.contains("critical")) {

            List<Threat> threats =
                    threatRepository.findByStatus(
                            com.threatlens.threatlens_backend.entity.ThreatStatus.OPEN
                    );

            long criticalCount =
                    threats.stream()
                            .filter(t -> t.getSeverity() == Severity.CRITICAL)
                            .count();

            return "There are currently "
                    + criticalCount
                    + " open critical threats. "
                    + "These should be investigated immediately.";
        }

        if (question.contains("brute force") ||
                question.contains("bruteforce")) {

            return """
                    A brute-force attack attempts to gain access
                    by repeatedly trying credentials.

                    ThreatLens detects this by monitoring repeated
                    failed login attempts from the same source.

                    Recommended actions:
                    • Rate-limit login requests
                    • Block suspicious IPs
                    • Enable MFA
                    • Review affected accounts
                    """;
        }

        if (question.contains("sql injection") ||
                question.contains("sqli")) {

            return """
                    SQL Injection occurs when malicious SQL input
                    is inserted into an application.

                    Recommended actions:
                    • Use prepared statements
                    • Validate input
                    • Use parameterized queries
                    • Apply least-privilege database access
                    """;
        }

        if (question.contains("xss")) {

            return """
                    XSS (Cross-Site Scripting) occurs when an attacker
                    injects executable JavaScript into application content.

                    Recommended actions:
                    • Sanitize input
                    • Encode output
                    • Use Content Security Policy
                    """;
        }

        if (question.contains("log")) {

            long totalLogs = logRepository.count();

            return "ThreatLens currently contains "
                    + totalLogs
                    + " security logs and "
                    + totalThreats
                    + " detected threats.";
        }

        return """
                I can help you analyze the ThreatLens security environment.

                Try asking:
                • How many threats are there?
                • How many critical threats are open?
                • Explain brute force
                • Explain SQL injection
                • Explain XSS
                • How many logs do we have?
                """;
    }
}
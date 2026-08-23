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
import java.util.regex.Pattern;

@Component
public class XssRule implements ThreatRule {

    private final ThreatRepository threatRepository;

    private static final Pattern XSS_PATTERN = Pattern.compile(
            "(<\\s*script\\b" +
                    "|<\\s*/\\s*script\\s*>" +
                    "|javascript\\s*:" +
                    "|onerror\\s*=" +
                    "|onload\\s*=" +
                    "|onclick\\s*=" +
                    "|onmouseover\\s*=" +
                    "|<\\s*iframe\\b" +
                    "|<\\s*img\\b[^>]*onerror" +
                    "|alert\\s*\\(" +
                    "|prompt\\s*\\(" +
                    "|confirm\\s*\\()",
            Pattern.CASE_INSENSITIVE
    );

    public XssRule(ThreatRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        String dataToAnalyze = buildSearchableText(log);

        if (!XSS_PATTERN.matcher(dataToAnalyze).find()) {
            return null;
        }

        // Prevent duplicate OPEN XSS threats from the same IP
        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.XSS,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.XSS);
        threat.setSeverity(Severity.HIGH);

        threat.setDescription(
                "Potential cross-site scripting (XSS) payload detected"
        );

        threat.setSourceIp(log.getIpAddress());
        threat.setUsername(log.getUsername());
        threat.setDetectedAt(LocalDateTime.now());
        threat.setStatus(ThreatStatus.OPEN);
        threat.setLog(log);

        return threat;
    }

    private String buildSearchableText(Log log) {

        String text = String.join(
                " ",
                safe(log.getEndpoint()),
                safe(log.getRequestBody()),
                safe(log.getUserAgent())
        );

        // Decode some common URL encoding
        text = text
                .replace("%20", " ")
                .replace("%3C", "<")
                .replace("%3E", ">")
                .replace("%2F", "/")
                .replace("%22", "\"")
                .replace("%27", "'")
                .replace("%28", "(")
                .replace("%29", ")");

        return text.toLowerCase(Locale.ROOT);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}

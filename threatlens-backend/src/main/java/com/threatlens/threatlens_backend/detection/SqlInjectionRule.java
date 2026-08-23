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
public class SqlInjectionRule implements ThreatRule {

    private final ThreatRepository threatRepository;

    private static final Pattern SQL_PATTERN = Pattern.compile(
            "(\\bunion\\s+select\\b" +
                    "|\\bselect\\s+.+\\s+from\\b" +
                    "|\\binsert\\s+into\\b" +
                    "|\\bupdate\\s+.+\\s+set\\b" +
                    "|\\bdelete\\s+from\\b" +
                    "|\\bdrop\\s+table\\b" +
                    "|\\bor\\s+1\\s*=\\s*1\\b" +
                    "|\\band\\s+1\\s*=\\s*1\\b" +
                    "|--\\s*$" +
                    "|/\\*.*?\\*/)",
            Pattern.CASE_INSENSITIVE
    );

    public SqlInjectionRule(ThreatRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    @Override
    public Threat detect(Log log) {

        String dataToAnalyze = buildSearchableText(log);

        System.out.println("SQL RULE CHECKING: " + dataToAnalyze);

        if (!SQL_PATTERN.matcher(dataToAnalyze).find()) {

            return null;
        }

        // Don't create duplicate OPEN SQL injection threats
        boolean alreadyDetected =
                threatRepository.existsByThreatTypeAndSourceIpAndStatus(
                        ThreatType.SQL_INJECTION,
                        log.getIpAddress(),
                        ThreatStatus.OPEN
                );

        if (alreadyDetected) {
            return null;
        }

        Threat threat = new Threat();

        threat.setThreatType(ThreatType.SQL_INJECTION);
        threat.setSeverity(Severity.CRITICAL);

        threat.setDescription(
                "Potential SQL injection pattern detected in HTTP request"
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

        // Decode common URL encoding
        text = text
                .replace("%20", " ")
                .replace("%27", "'")
                .replace("%22", "\"")
                .replace("%3D", "=")
                .replace("%2D", "-");

        return text.toLowerCase(Locale.ROOT);
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}

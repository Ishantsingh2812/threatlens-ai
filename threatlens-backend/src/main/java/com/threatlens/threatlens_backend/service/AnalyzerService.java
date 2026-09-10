package com.threatlens.threatlens_backend.service;

import com.threatlens.threatlens_backend.dto.AnalyzerResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyzerService {

    public AnalyzerResponse analyze(String logInput) {

        if (logInput == null || logInput.isBlank()) {
            return new AnalyzerResponse(
                    "UNKNOWN",
                    "LOW",
                    0,
                    0,
                    List.of("No log data was provided."),
                    "Provide a valid security log for analysis."
            );
        }

        String log = logInput.toLowerCase();

        String threatType = "SUSPICIOUS_HTTP";
        String severity = "MEDIUM";
        int riskScore = 55;
        int confidence = 78;

        List<String> reasons = new ArrayList<>();

        String recommendation =
                "Review this request and monitor the source IP.";

        // ==========================================
        // BRUTE FORCE
        // ==========================================

        if (
                log.contains("failed login") ||
                        log.contains("login failed") ||
                        log.contains("401")
        ) {

            threatType = "BRUTE_FORCE";
            severity = "CRITICAL";
            riskScore = 92;
            confidence = 94;

            reasons.add("Failed authentication attempt detected.");
            reasons.add("HTTP 401 indicates authentication failure.");
            reasons.add(
                    "Repeated login failures may indicate a credential attack."
            );

            recommendation =
                    "Rate-limit the source IP and consider temporarily blocking it.";
        }

        // ==========================================
        // SQL INJECTION
        // ==========================================

        else if (
                log.contains("select ") ||
                        log.contains("union select") ||
                        log.contains("drop table") ||
                        log.contains("' or '1'='1") ||
                        log.contains("sql")
        ) {

            threatType = "SQL_INJECTION";
            severity = "CRITICAL";
            riskScore = 96;
            confidence = 96;

            reasons.add("SQL keywords detected in request.");
            reasons.add(
                    "Input contains suspicious database query patterns."
            );
            reasons.add(
                    "Pattern is commonly associated with SQL injection attacks."
            );

            recommendation =
                    "Block the request and sanitize all user-controlled database inputs.";
        }

        // ==========================================
        // XSS
        // ==========================================

        else if (
                log.contains("<script") ||
                        log.contains("javascript:") ||
                        log.contains("onerror=") ||
                        log.contains("onload=")
        ) {

            threatType = "XSS";
            severity = "HIGH";
            riskScore = 88;
            confidence = 93;

            reasons.add("Script injection pattern detected.");
            reasons.add(
                    "Potential executable JavaScript found in input."
            );
            reasons.add(
                    "Request may attempt client-side code execution."
            );

            recommendation =
                    "Sanitize the input and apply proper output encoding.";
        }

        // ==========================================
        // NOT FOUND SCAN
        // ==========================================

        else if (
                log.contains("404") ||
                        log.contains("not found") ||
                        log.contains("/admin") ||
                        log.contains("/wp-admin")
        ) {

            threatType = "NOT_FOUND_SCAN";
            severity = "MEDIUM";
            riskScore = 64;
            confidence = 82;

            reasons.add("Resource returned HTTP 404.");
            reasons.add(
                    "Potential enumeration of hidden endpoints."
            );
            reasons.add(
                    "Repeated 404 responses can indicate reconnaissance."
            );

            recommendation =
                    "Monitor the source IP for repeated endpoint enumeration.";
        }

        // ==========================================
        // RATE LIMIT
        // ==========================================

        else if (
                log.contains("too many requests") ||
                        log.contains("429") ||
                        log.contains("rate limit")
        ) {

            threatType = "RATE_LIMIT_VIOLATION";
            severity = "HIGH";
            riskScore = 81;
            confidence = 90;

            reasons.add("HTTP 429 / rate-limit pattern detected.");
            reasons.add(
                    "Request frequency may exceed allowed limits."
            );
            reasons.add(
                    "Potential automated or abusive traffic."
            );

            recommendation =
                    "Apply rate limiting and investigate the source IP.";
        }

        // ==========================================
        // UNUSUAL LOGIN
        // ==========================================

        else if (
                log.contains("unusual login") ||
                        log.contains("new location") ||
                        log.contains("suspicious login")
        ) {

            threatType = "UNUSUAL_LOGIN";
            severity = "HIGH";
            riskScore = 76;
            confidence = 85;

            reasons.add("Login activity appears unusual.");
            reasons.add(
                    "Login context differs from expected behavior."
            );
            reasons.add(
                    "Potential account compromise should be investigated."
            );

            recommendation =
                    "Verify the user's identity and review recent account activity.";
        }

        // ==========================================
        // DEFAULT
        // ==========================================

        else {

            reasons.add(
                    "HTTP request contains potentially suspicious activity."
            );

            reasons.add(
                    "No high-confidence attack signature was identified."
            );

            reasons.add(
                    "Further investigation is recommended."
            );
        }

        return new AnalyzerResponse(
                threatType,
                severity,
                riskScore,
                confidence,
                reasons,
                recommendation
        );
    }
}

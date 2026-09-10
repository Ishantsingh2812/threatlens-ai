package com.threatlens.threatlens_backend.dto;

import java.util.List;

public class AnalyzerResponse {

    private String threatType;
    private String severity;
    private int riskScore;
    private int confidence;
    private List<String> reasons;
    private String recommendation;

    public AnalyzerResponse() {
    }

    public AnalyzerResponse(
            String threatType,
            String severity,
            int riskScore,
            int confidence,
            List<String> reasons,
            String recommendation
    ) {
        this.threatType = threatType;
        this.severity = severity;
        this.riskScore = riskScore;
        this.confidence = confidence;
        this.reasons = reasons;
        this.recommendation = recommendation;
    }

    public String getThreatType() {
        return threatType;
    }

    public void setThreatType(String threatType) {
        this.threatType = threatType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public int getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(int riskScore) {
        this.riskScore = riskScore;
    }

    public int getConfidence() {
        return confidence;
    }

    public void setConfidence(int confidence) {
        this.confidence = confidence;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }
}
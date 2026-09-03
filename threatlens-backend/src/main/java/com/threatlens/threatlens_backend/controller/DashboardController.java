package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.dto.DashboardStats;
import com.threatlens.threatlens_backend.entity.Severity;
import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.entity.ThreatStatus;
import com.threatlens.threatlens_backend.repository.LogRepository;
import com.threatlens.threatlens_backend.repository.ThreatRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class DashboardController {

    private final LogRepository logRepository;
    private final ThreatRepository threatRepository;

    public DashboardController(
            LogRepository logRepository,
            ThreatRepository threatRepository
    ) {
        this.logRepository = logRepository;
        this.threatRepository = threatRepository;
    }

    @GetMapping("/stats")
    public DashboardStats getStats() {

        long totalLogs = logRepository.count();

        long totalThreats = threatRepository.count();

        long criticalThreats =
                threatRepository.countBySeverity(Severity.CRITICAL);

        long highThreats =
                threatRepository.countBySeverity(Severity.HIGH);

        long mediumThreats =
                threatRepository.countBySeverity(Severity.MEDIUM);

        long openThreats =
                threatRepository.countByStatus(ThreatStatus.OPEN);

        return new DashboardStats(
                totalLogs,
                totalThreats,
                criticalThreats,
                highThreats,
                mediumThreats,
                openThreats
        );
    }

    @GetMapping("/threat-activity")
    public List<Object[]> getThreatActivity() {
        return threatRepository.getThreatActivity();
    }


    @GetMapping("/threat-types")
    public List<Object[]> getThreatTypeDistribution() {
        return threatRepository.getThreatTypeDistribution();
    }

    @GetMapping("/recent-threats")
    public List<Threat> getRecentThreats() {
        return threatRepository.findTop10ByOrderByDetectedAtDesc();
    }
}
package com.threatlens.threatlens_backend.dto;

import com.threatlens.threatlens_backend.entity.Severity;
import lombok.Getter;

@Getter
public class DashboardStats {

    private final long totalLogs;
    private final long totalThreats;
    private final long criticalThreats;
    private final long highThreats;
    private final long mediumThreats;
    private final long openThreats;

    public DashboardStats(
            long totalLogs,
            long totalThreats,
            long criticalThreats,
            long highThreats,
            long mediumThreats,
            long openThreats
    ) {
        this.totalLogs = totalLogs;
        this.totalThreats = totalThreats;
        this.criticalThreats = criticalThreats;
        this.highThreats = highThreats;
        this.mediumThreats = mediumThreats;
        this.openThreats = openThreats;
    }

}

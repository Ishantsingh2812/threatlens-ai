package com.threatlens.threatlens_backend.service;

import com.threatlens.threatlens_backend.detection.ThreatRule;
import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.repository.ThreatRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DetectionService {

    private final List<ThreatRule> rules;
    private final ThreatRepository threatRepository;

    public DetectionService(
            List<ThreatRule> rules,
            ThreatRepository threatRepository
    ) {
        this.rules = rules;
        this.threatRepository = threatRepository;
    }

    public void analyze(Log log) {

        for (ThreatRule rule : rules) {

            Threat threat = rule.detect(log);

            if (threat != null) {
                threatRepository.save(threat);

                System.out.println(
                        "🚨 THREAT DETECTED: "
                                + threat.getThreatType()
                );
            }
        }
    }
}

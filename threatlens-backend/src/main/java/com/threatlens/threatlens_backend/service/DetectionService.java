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
    private final WebSocketService webSocketService;

    public DetectionService(
            List<ThreatRule> rules,
            ThreatRepository threatRepository,
            WebSocketService webSocketService
    ) {
        this.rules = rules;
        this.threatRepository = threatRepository;
        this.webSocketService = webSocketService;
    }


    public void analyze(Log log) {

        System.out.println("🔍 Analyzing log: " + log.getId());

        for (ThreatRule rule : rules) {

            Threat threat = rule.detect(log);

            if (threat != null) {

                Threat savedThreat = threatRepository.save(threat);

                System.out.println(
                        "🚨 THREAT DETECTED: "
                                + savedThreat.getThreatType()
                );

                webSocketService.sendThreat(savedThreat);
            }
        }
    }
}


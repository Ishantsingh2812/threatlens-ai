package com.threatlens.threatlens_backend.controller;


import com.threatlens.threatlens_backend.entity.Threat;
import com.threatlens.threatlens_backend.entity.ThreatStatus;
import com.threatlens.threatlens_backend.repository.ThreatRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/threats")
@CrossOrigin(origins = {"http://localhost:5173",
        "http://localhost:5173"
})
public class ThreatController {

    private final ThreatRepository threatRepository;

    public ThreatController(ThreatRepository threatRepository) {
        this.threatRepository = threatRepository;
    }

    @GetMapping
    public List<Threat> getAllThreats() {
        return threatRepository.findAll();
    }

    @GetMapping("/{id}")
    public Threat getThreatById(@PathVariable Long id) {
        return threatRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Threat not found"));
    }

    @PostMapping
    public Threat createThreat(@RequestBody Threat threat) {
        return threatRepository.save(threat);
    }

    // UPDATE THREAT STATUS
    @PutMapping("/{id}/status")
    public Threat updateThreatStatus(
            @PathVariable Long id,
            @RequestParam ThreatStatus status
    ) {

        Threat threat = threatRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Threat not found"));

        threat.setStatus(status);

        return threatRepository.save(threat);
    }
}

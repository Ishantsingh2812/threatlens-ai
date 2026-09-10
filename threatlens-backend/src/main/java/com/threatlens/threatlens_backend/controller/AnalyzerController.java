package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.dto.AnalyzerRequest;
import com.threatlens.threatlens_backend.dto.AnalyzerResponse;
import com.threatlens.threatlens_backend.service.AnalyzerService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analyzer")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class AnalyzerController {

    private final AnalyzerService analyzerService;

    public AnalyzerController(AnalyzerService analyzerService) {
        this.analyzerService = analyzerService;
    }

    @PostMapping("/analyze")
    public AnalyzerResponse analyze(
            @RequestBody AnalyzerRequest request
    ) {

        return analyzerService.analyze(request.getLog());
    }
}

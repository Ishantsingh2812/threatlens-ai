package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.service.CopilotService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/copilot")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class CopilotController {

    private final CopilotService copilotService;

    public CopilotController(CopilotService copilotService) {
        this.copilotService = copilotService;
    }

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> request) {

        String message = request.get("message");

        String response = copilotService.generateResponse(message);

        return Map.of(
                "response", response
        );
    }
}

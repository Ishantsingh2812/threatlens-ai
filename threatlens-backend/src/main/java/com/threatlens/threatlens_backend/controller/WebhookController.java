package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.service.LogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/webhooks")
public class WebhookController {

    private final LogService logService;

    public WebhookController(LogService logService) {
        this.logService = logService;
    }

    @PostMapping("/logs")
    public ResponseEntity<Log> receiveLog(@RequestBody Log log) {

        Log savedLog = logService.saveLog(log);

        return ResponseEntity.ok(savedLog);
    }
}

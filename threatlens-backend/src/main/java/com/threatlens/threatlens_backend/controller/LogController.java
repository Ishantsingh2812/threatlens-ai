package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.repository.LogRepository;
import com.threatlens.threatlens_backend.service.DetectionService;
import com.threatlens.threatlens_backend.service.WebSocketService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://localhost:5174"
})
public class LogController {

    private final LogRepository logRepository;
    private final DetectionService detectionService;
    private final WebSocketService webSocketService;

    public LogController(
            LogRepository logRepository,
            DetectionService detectionService,
            WebSocketService webSocketService) {

        this.logRepository = logRepository;
        this.detectionService = detectionService;
        this.webSocketService = webSocketService;
    }

    @PostMapping
    public Log saveLog(@RequestBody Log log) {

        if (log.getTimestamp() == null) {
            log.setTimestamp(LocalDateTime.now());
        }

        Log savedLog = logRepository.save(log);

        webSocketService.sendLog(savedLog);

        detectionService.analyze(savedLog);

        return savedLog;
    }

    @GetMapping
    public List<Log> getLogs() {
        return logRepository.findAll();
    }
}
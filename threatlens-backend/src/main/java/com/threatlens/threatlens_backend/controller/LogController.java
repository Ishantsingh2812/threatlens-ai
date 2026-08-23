package com.threatlens.threatlens_backend.controller;

import com.threatlens.threatlens_backend.repository.LogRepository;

import com.threatlens.threatlens_backend.entity.Log;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logs")
@CrossOrigin(origins = "http://localhost:5173")
public class LogController {

    private final LogRepository logRepository;

    public LogController(LogRepository logRepository) {
        this.logRepository = logRepository;
    }

    @GetMapping
    public List<Log> getLogs() {
        return logRepository.findAll();
    }


    @PostMapping
    public Log createLog(@RequestBody Log log) {
        return logRepository.save(log);
    }
}

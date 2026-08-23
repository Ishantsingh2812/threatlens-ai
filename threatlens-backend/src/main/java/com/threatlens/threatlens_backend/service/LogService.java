package com.threatlens.threatlens_backend.service;


import com.threatlens.threatlens_backend.detection.*;
import com.threatlens.threatlens_backend.entity.Log;
import com.threatlens.threatlens_backend.repository.LogRepository;
import org.springframework.stereotype.Service;

@Service
public class LogService {

    private final LogRepository logRepository;
    private final DetectionService detectionService;

    public LogService(
            LogRepository logRepository,
            DetectionService detectionService
    ) {
        this.logRepository = logRepository;
        this.detectionService = detectionService;
    }

    public Log saveLog(Log log) {

        Log savedLog = logRepository.save(log);

        detectionService.analyze(savedLog);

        return savedLog;
    }
}
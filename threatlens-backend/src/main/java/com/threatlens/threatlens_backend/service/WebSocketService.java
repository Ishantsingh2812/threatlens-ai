package com.threatlens.threatlens_backend.service;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketService(
            SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void sendLog(Object log) {
        messagingTemplate.convertAndSend(
                "/topic/logs",
                log
        );
    }
    public void sendThreat(Object threat) {

        System.out.println("📡 Sending threat through WebSocket: " + threat);

        messagingTemplate.convertAndSend("/topic/threats", threat);
    }
}

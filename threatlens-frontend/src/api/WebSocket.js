import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

let client = null;

export const connectWebSocket = (
  onLogReceived,
  onThreatReceived
) => {
  client = new Client({
    webSocketFactory: () =>
      new SockJS("http://localhost:8080/ws"),

    reconnectDelay: 5000,

    onConnect: () => {
      console.log("✅ WebSocket connected");

      client.subscribe("/topic/logs", (message) => {
        const log = JSON.parse(message.body);

        if (onLogReceived) {
          onLogReceived(log);
        }
      });

      client.subscribe("/topic/threats", (message) => {
        const threat = JSON.parse(message.body);

        console.log("🚨 NEW THREAT:", threat);

        if (onThreatReceived) {
          onThreatReceived(threat);
        }
      });
    },

    onStompError: (frame) => {
      console.error(
        "WebSocket error:",
        frame.headers["message"]
      );
    },
  });

  client.activate();
};

export const disconnectWebSocket = () => {
  if (client) {
    client.deactivate();
    client = null;
  }
};
import type { WsPayload } from "@pinturillo/shared/src/events";

type MessageHandler = (payload: unknown) => void;

export class Socket {
  private ws: WebSocket | null = null;
  private pendingMessages: WsPayload[] = [];
  private onMessageHandler?: MessageHandler;

  constructor(url: string, onMessageHandler?: MessageHandler) {
    this.onMessageHandler = onMessageHandler;
    this.connect(url);
  }

  private connect(url: string) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.sendPendingMessages();
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.ws.onerror = (event: Event) => {
      console.error("WebSocket error:", event);
    };

    this.ws.onclose = () => {
      console.info("WebSocket connection closed");
    };
  }

  send(payload: WsPayload) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push(payload);
      return;
    }

    this.ws.send(JSON.stringify(payload));
  }

  private sendPendingMessages() {
    while (this.pendingMessages.length > 0) {
      const payload = this.pendingMessages.shift();

      if (payload) {
        this.send(payload);
      }
    }
  }

  handleMessage(event: MessageEvent) {
    try {
      const payload = JSON.parse(event.data);

      if (this.onMessageHandler) {
        this.onMessageHandler(payload);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  setMessageHandler(callback: MessageHandler) {
    this.onMessageHandler = callback;
  }
}

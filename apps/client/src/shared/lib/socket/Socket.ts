import type { WsPayload } from "@pinturillo/shared/src/events";
import type { WsACK } from "@pinturillo/shared/src/responses";

type MessageHandler = (payload: unknown) => void;

interface PendingRequest {
  resolve: (value: WsACK | PromiseLike<WsACK>) => void;
  reject: (reason?: unknown) => void;
  timeout: ReturnType<typeof setTimeout>;
}

export class Socket {
  private ws: WebSocket | null = null;
  private pendingMessages: WsPayload[] = [];
  private pendingRequests = new Map<string, PendingRequest>();
  private onMessageHandler?: MessageHandler;
  private readonly DEFAULT_TIMEOUT_MS = 8000;

  constructor(url: string, onMessageHandler?: MessageHandler) {
    this.onMessageHandler = onMessageHandler;
    this.connect(url);
  }

  private connect(url: string) {
    try {
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
        this.rejectAllPendingRequests(new Error("WebSocket connection closed"));
      };
    } catch (e) {
      console.error(e);
    }
  }

  // For static info send that does not requires a loading state (i.e: drawing, guessing)
  async send(payload: WsPayload) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.pendingMessages.push(payload);
      return;
    }

    this.ws.send(JSON.stringify(payload));
  }

  // For info send that requires validation
  async request(payload: WsPayload, timeoutMs = this.DEFAULT_TIMEOUT_MS): Promise<WsACK> {
    const correlationId = crypto.randomUUID();
    const paylodToSend = { ...payload, correlationId: correlationId };

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Request take too long"));
      }, timeoutMs);

      try {
        this.pendingRequests.set(correlationId, { resolve: resolve, reject: reject, timeout: timeout });

        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
          this.pendingMessages.push(paylodToSend);
          return;
        }

        this.ws.send(JSON.stringify(paylodToSend));
      } catch (e) {
        reject(new Error(`Error sending the request: ${e}`));
      }
    });
  }

  private sendPendingMessages() {
    while (this.pendingMessages.length > 0) {
      const payload = this.pendingMessages.shift();
      if (payload && this.ws) {
        this.ws.send(JSON.stringify(payload));
      }
    }
  }

  handleMessage(event: MessageEvent) {
    try {
      const payload = JSON.parse(event.data) as WsACK;

      // If the payload has correlationId it is a request so look for the pending request and if it is still pending, resolve it
      if (payload.data?.correlationId && this.pendingRequests.has(payload.data?.correlationId)) {
        const pending = this.pendingRequests.get(payload.data?.correlationId)!;

        clearTimeout(pending.timeout);
        this.pendingRequests.delete(payload.data?.correlationId);

        if (!payload.success) {
          pending.reject(payload.data?.message);
        } else {
          pending.resolve(payload);
        }
      }

      if (this.onMessageHandler) {
        this.onMessageHandler(payload);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  }

  private rejectAllPendingRequests(reason: unknown) {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeout);
      pending.reject(reason);
    }
    this.pendingRequests.clear();
  }

  setMessageHandler(callback: MessageHandler) {
    this.onMessageHandler = callback;
  }
}

import app from "./app";
import { createServer } from "http";
import { WebSocketServer } from "ws";

const PORT = 3000;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ message: "Web socket running..." }));
});

httpServer.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

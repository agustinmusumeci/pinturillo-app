import app from "./app";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { ConnectionController } from "./controllers/ConnectionController";

const PORT = 3000;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

const connectionController = new ConnectionController(wss);

httpServer.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

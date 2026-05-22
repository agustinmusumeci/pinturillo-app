import app from "./app";
import { createServer } from "http";
import { WebSocketServer } from "ws";
import { ConnectionsController } from "./controllers/ConnectionsController";

const PORT = 3000;
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

export const connectionController = new ConnectionsController(wss);

httpServer.listen(PORT, () => {
  console.log(`Server at http://localhost:${PORT}`);
});

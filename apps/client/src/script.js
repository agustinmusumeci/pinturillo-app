const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  ws.send(JSON.stringify({ event: "RECONNECT", data: { connectionId: 1234 } }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Mensaje:", data);
};

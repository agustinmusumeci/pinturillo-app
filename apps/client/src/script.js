const ws = new WebSocket("ws://localhost:3000");

ws.onopen = () => {
  ws.send(JSON.stringify({ event: "JOIN_ROOM", payload: { name: "Agustin", roomId: "1234" } }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("Mensaje:", data);
};

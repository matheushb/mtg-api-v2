import { Server } from "socket.io";

const PORT = 4000;

const io = new Server(PORT, {
  cors: {
    origin: "*",
  },
});

console.log(`WebSocket Server rodando na porta ${PORT}`);

io.on("connection", (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);

  socket.on("deck_update", (data) => {
    console.log("Mensagem recebida no WebSocket:", data);
  });

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  });
});

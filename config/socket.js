const socketIO = require('socket.io');

const initSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:5173", // Your frontend's URL
      methods: ["GET", "POST"],
      credentials: true,
    },
    transports: ['websocket', 'polling'], // Allow WebSocket and fallback to polling
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = { initSocket };

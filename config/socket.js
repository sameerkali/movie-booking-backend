const socketIO = require('socket.io');
let io;

const initSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    // Listen to seat reservation
    socket.on('reserveSeat', (data) => {
      io.emit('seatUpdate', data); // Broadcast seat updates to all clients
    });

    // Broadcast price update to all clients
    socket.on('priceUpdate', (data) => {
      io.emit('updatePrice', data); // Broadcast the updated price
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = { initSocket, io };

const socketIO = require('socket.io');
let io; // Declare the io variable globally

const initSocket = (server) => {
  io = socketIO(server); // Initialize the io object

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('reserveSeat', (data) => {
      io.emit('seatUpdate', data); // Emit seat update to all connected clients
    });

    socket.on('priceUpdate', (data) => {
      io.emit('updatePrice', data); // Emit price update to all connected clients
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = { initSocket, io }; // Export both the init function and io object

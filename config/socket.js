const socketIO = require('socket.io');
let io;

const initSocket = (server) => {
  io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('reserveSeat', (data) => {
      io.emit('seatUpdate', data); 
    });

    socket.on('priceUpdate', (data) => {
      io.emit('updatePrice', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
};

module.exports = { initSocket, io };

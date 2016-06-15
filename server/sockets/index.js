let io = require('socket.io');

module.exports = (server) => {
  io = io(server, { path: '/docman/rtc' });

  io.on('connection', (socket) => {
    socket.on('role:join', (role) => {
      socket.join(role);
    });

    socket.on('role:leave', (role) => {
      socket.leave(role);
    });
  });

  return io;
};

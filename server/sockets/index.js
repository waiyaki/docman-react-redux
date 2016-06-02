(function () {
  'use strict';

  module.exports = function (server) {
    var io = require('socket.io')(server, {path: '/docman/rtc'});

    io.on('connection', function (socket) {
      socket.on('role:join', function (role) {
        socket.join(role);
      });

      socket.on('role:leave', function (role) {
        socket.leave(role);
      });
    });

    return io;
  };
})();

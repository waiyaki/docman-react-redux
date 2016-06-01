(function () {
  'use strict';

  module.exports = function (server) {
    var io = require('socket.io')(server, {path: '/docman/rtc'});

    io.on('connection', function (socket) {
      socket.emit('welcome', {welcome: 'welcome to DocMan'});
      socket.on('thankyou', function (data) {
        console.log('Received thank you: ', data);
      });

      socket.on('role:join', function (role) {
        console.log('Joining: ', role);
        socket.join(role);
      });

      socket.on('role:leave', function (role) {
        socket.leave(role);
      });
    });

    return io;
  };
})();

(function () {
  'use strict';

  var User = require('./users');
  var Role = require('./roles');

  Role.initialize(); // Create default roles.

  module.exports = {
    Role: Role,
    User: User
  };
})();

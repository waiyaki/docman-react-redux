(function () {
  'use strict';

  var User = require('./users');
  var Role = require('./roles');
  var Document = require('./documents');

  Role.initialize(); // Create default roles.

  module.exports = {
    Role: Role,
    User: User,
    Document: Document
  };
})();

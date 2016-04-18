(function () {
  'use strict';

  var mongoose = require('mongoose');

  var RoleSchema = new mongoose.Schema({
    title: {
      type: String,
      default: 'user',
      enum: ['user', 'owner', 'admin', 'public']
    }
  });

  module.exports = mongoose.model('Role', RoleSchema);
})();

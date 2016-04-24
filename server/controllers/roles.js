(function () {
  'use strict';

  var Role = require('../models').Role;
  var resolveError = require('../utils');

  module.exports = {
    list: function (req, res) {
      Role.all(function (err, roles) {
        if (err) {
          return resolveError(err, res);
        }
        return res.status(200).send(roles);
      });
    }
  };
})();

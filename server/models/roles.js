(function () {
  'use strict';

  var mongoose = require('mongoose');

  var RoleSchema = new mongoose.Schema({
    title: {
      type: String,
      default: 'user',
      unique: true,
      enum: ['user', 'owner', 'admin', 'public']
    }
  });

  /**
   * Create all four acceptable roles when this model initializes.
   */
  RoleSchema.statics.initialize = function () {
    var role = this;
    return new Promise(function (resolve, reject) {
      var defaults = role.schema.paths.title.enumValues;
      defaults = defaults.map(function (value) {
        return {title: value};
      });

      role.create(defaults, function (err, values) {
        if (err) {
          reject(err);
        }
        resolve(values);
      });
    });
  };

  RoleSchema.statics.all = function (cb) {
    return this.find({}, cb);
  };

  module.exports = mongoose.model('Role', RoleSchema);
})();

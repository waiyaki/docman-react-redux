(function () {
  'use strict';

  var mongoose = require('mongoose');
  var bcrypt = require('bcrypt');
  var jwt = require('jsonwebtoken');
  var app_config = require('../config/config');

  var UserSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    name: {
      first_name: String,
      last_name: String
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  });

  /**
   * Get a virtual full name.
   */
  UserSchema.virtual('name.full_name').get(function () {
    var full = this.name.first_name || '';
    full = this.name.last_name ? full + ' ' + this.name.last_name : full;

    return full || null;
  });

  /**
   * Set a user's names, given the full name.
   */
  UserSchema.virtual('name.full_name').set(function (name) {
    if (name) {
      name = name.split(' ');
      this.name.first_name = name[0];
      this.name.last_name = name.slice(1).join(' ');
    }
  });

  /**
   * Hash user password before saving it in the db.
   */
  UserSchema.pre('save', function (next) {
    // Don't rehash the password if it was not modified.
    if (!this.isModified('password')) {
      return next();
    }

    // Replace password with the hashed version.
    this.password = bcrypt.hashSync(this.password, 8);
    next();
  });

  /**
   * Ensure a given password matches the hash.
   */
  UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  /**
   * Generate a json web token for this particular user.
   */
  UserSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
      _id: this._id,
      email: this.email,
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000)
    }, app_config.SECRET_KEY);
  };

  module.exports = mongoose.model('User', UserSchema);
})();

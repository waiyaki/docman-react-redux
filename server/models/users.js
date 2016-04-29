(function () {
  'use strict';

  var mongoose = require('mongoose');
  var bcrypt = require('bcrypt-nodejs');
  var jwt = require('jsonwebtoken');
  var appConfig = require('../config/config');

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
      firstName: String,
      lastName: String
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  });

  /**
   * Autopopulate role and owner when calling the hooked method.
   */
  var autopopulateFields = function (next) {
    this.populate('role', '-__v');
    next();
  };

  UserSchema
    .pre('find', autopopulateFields)
    .pre('findOne', autopopulateFields)
    .pre('findById', autopopulateFields);

  /**
   * Get a virtual full name.
   */
  UserSchema.virtual('name.fullName').get(function () {
    var full = this.name.firstName || '';
    full = this.name.lastName ? full + ' ' + this.name.lastName : full;

    return full || null;
  });

  /**
   * Set a user's names, given the full name.
   */
  UserSchema.virtual('name.fullName').set(function (name) {
    if (name) {
      name = name.split(' ');
      this.name.firstName = name[0];
      this.name.lastName = name.slice(1).join(' ');
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
    this.password = bcrypt.hashSync(this.password);
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
      username: this.username,
      exp: parseInt(expiry.getTime() / 1000)
    }, appConfig.SECRET_KEY);
  };

  module.exports = mongoose.model('User', UserSchema);
})();

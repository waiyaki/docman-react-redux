/* eslint-disable func-names */
const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Update updatedAt everytime the document is saved.
 */
DocumentSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Autopopulate role and owner when calling the hooked method.
 */
const autopopulateFields = function (next) {
  this.populate('role', '-__v');
  this.populate('owner', '-__v');
  this.populate('owner.role', '-__v');
  next();
};

DocumentSchema
  .pre('find', autopopulateFields)
  .pre('findOne', autopopulateFields);

module.exports = mongoose.model('Document', DocumentSchema);

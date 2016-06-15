/* eslint-disable func-names */
const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'user',
    unique: true,
    enum: ['user', 'private', 'admin', 'public']
  },
  accessLevel: {
    type: Number,
    default: 0
  }
});

/**
 * Associate the role with it's correct access level before saving it.
 */
RoleSchema.pre('save', function (next) {
  const accessLevelsMap = {
    admin: 4,
    private: 3,
    user: 2,
    public: 1
  };

  this.accessLevel = accessLevelsMap[this.title];
  next();
});

/**
 * Create all four acceptable roles when this model initializes.
 */
RoleSchema.statics.initialize = function () {
  const role = this;
  return new Promise((resolve, reject) => {
    let defaults = role.schema.paths.title.enumValues;
    defaults = defaults.map((value) => { // eslint-disable-line
      return { title: value };
    });

    role.create(defaults, (err, values) => {
      if (err) {
        reject(err);
      }
      resolve(values);
    });
  });
};

RoleSchema.statics.all = function (cb) {
  this.find({}, cb);
};

module.exports = mongoose.model('Role', RoleSchema);

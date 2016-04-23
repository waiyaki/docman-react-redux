(function () {
  /**
   * Utility to hold and/or create an assortment of data to use during testing.
   */

  process.env.NODE_ENV = 'testing'; // Ensures we're using the test db.

  var app = require('../../app');
  var request = require('supertest')(app);
  var User = require('../../server/models').User;
  var Role = require('../../server/models').Role;

  module.exports = {
    /**
     * Wherever you need raw user data, use this one.
     */
    testUserData: require('./testUserData.json'),

    /**
     * Wherever you require users in bulk, user these ones.
     */
    testUsers: require('./testUsers.json'),

    /**
     * Create a user using a HTTP POST request.
     */
    createUserByPost: function (data, _log) {
      // If only _log was passed, make data null in order to use the default.
      if (!_log && typeof data !== 'object') {
        _log = data;
        data = null;
      }
      data = data || this.testUserData;
      return new Promise(function (resolve, reject) {
        log(['Attempting to create user with data', data], _log);
        return request
          .post('/users')
          .send(data)
          .accept('application/json')
          .end(function (err, res) {
            if (err) {
              reject(err);
              return;
            }
            log('User created successfully.', _log);
            resolve(res);
          });
      });
    },

    /**
     * Login a user.
     */
    login: function (userData, _log) {
      userData = userData || this.testUserData;
      return new Promise(function (resolve, reject) {
        log([
          'Attempting to login user', userData.username,
          'with password', userData.password, '...'], _log);
        return request
          .post('/users/login')
          .send(userData)
          .accept('application/json')
          .end(function (err, res) {
            if (err) {
              reject(err);
            } else {
              log('Logged in.', _log);
              resolve(res);
            }
          });
      });
    },

    /**
     * Get an authentication token from the API by logging in a user.
     *
     * Should have used a module like superagent to make the API call here,
     * but supertest should work just fine - less one dependency! ¯\_(ツ)_/¯
     */
    getToken: function (username, password, _log) {
      // Treacherous waters here...
      // Username, password and _log are all optional. Assume that if any
      // of them is a boolean, that was meant to be the _log.
      if (typeof username === 'boolean') {
        _log = username;
        username = null;
        password = null;
      } else if (typeof password === 'boolean') {
        _log = password;
        password = null;
      }

      username = username || 'test';
      password = password || 'test-password';
      return this.login({username: username, password: password})
        .then(function (res) {
          return res.body.token;
        });
    },

    /**
     * Promote a user to 'admin' status.
     */
    makeAdmin: function (username, _log) {
      var _this = this;
      username = username || this.testUserData.username;
      return new Promise(function (resolve, reject) {
        log(['Attempting to promote user', username, 'to admin status...'], _log);
        _this.getAdminRole()
          .then(function (role) {
            User.findOneAndUpdate({ username: username }, {
              $set: {
                role: role._id
              }
            }, function (err, user) {
              if (err) {
                reject(err);
                return;
              }

              log(['Promoted ', username, ' to admin status.'], _log);
              resolve(user);
            });
          });
      });
    },

    /**
     * Seed the system with users.
     */
    seedTestUsers: function (_log) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        log('Seeding test users...', _log);
        User.create(_this.testUsers, function (err, users) {
          if (err) {
            reject(err);
          } else {
            log(['Created', _this.testUsers.length, ' users.'], _log);
            resolve(users);
          }
        });
      });
    },

    /**
     * Remove all seeded users from the db.
     * Don't remove users we didn't create.
     */
    destroyTestUsers: function (_log) {
      return new Promise(function (resolve, reject) {
        log('Removing test users...', _log);
        User.find({}, function (err, users) {
          if (err) {
            reject(err);
            return;
          }
          users.forEach(function (user) {
            User.findOneAndRemove({username: user.username}, function (err) {
              if (err) {
                reject(err);
                return;
              }
              log(['Removed:', user.username], _log);
            });
          });
          resolve(true);
        });
      });
    },

    /**
     * Get the admin role.
     */
    getAdminRole: function () {
      return new Promise(function (resolve, reject) {
        Role.findOne({title: 'admin'}, function (err, role) {
          if (err) {
            reject(err);
            return;
          }
          resolve(role);
        });
      });
    }
  };

  /**
   * Simple logger.
   *
   * @param {_log} Boolean Whether or not to log to the console.
   * @param {items} Array|String A string or an array of items to log to the console.
   */
  function log (items, _log) {
    /* eslint-disable no-console */
    if (_log) {
      if (Array.isArray(items)) {
        console.log(items.join(' '));
      } else {
        console.log(items);
      }
    }
  /* eslint-enable no-console */
  }
}());